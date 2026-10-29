#!/usr/bin/env node
/**
 * 链接巡检。
 *
 * 关键点：**403 不是死链**。国内 .gov.cn 站点普遍有 WAF，对脚本请求返回 403/412/521，
 * 浏览器打开却完全正常。把这类判成「坏了」会让巡检变成噪音，最后没人看。
 * 所以状态分四档，只有 dead 才让 CI 失败：
 *   ok      2xx/3xx
 *   blocked 4xx 中的鉴权/WAF 类，或 CDN 的 52x —— 需要人点开看一眼
 *   dead    404/410/DNS 不存在 —— 确定的死链
 *   unknown 5xx、超时、连接重置 —— 可能是临时故障，下次再看
 */
import { writeFile } from 'node:fs/promises';

import { entryUrl, loadEntries } from './lib/dataset.mjs';
import { pool, request } from './lib/http.mjs';
import { LINK_STATUS_FILE } from './lib/paths.mjs';
import { bad, dim, info, ok, warn } from './lib/log.mjs';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const BLOCKED = new Set([401, 403, 405, 406, 407, 412, 418, 421, 429, 451, 520, 521, 522, 523, 999]);
const DEAD = new Set([404, 410]);

function classify(res) {
  if (!res.ok) {
    if (res.error === 'dns') return { status: 'dead', reason: 'DNS 解析失败' };
    return { status: 'unknown', reason: res.error };
  }
  if (res.status < 400) return { status: 'ok' };
  if (DEAD.has(res.status)) return { status: 'dead' };
  if (BLOCKED.has(res.status)) return { status: 'blocked' };
  return { status: 'unknown' };
}

async function probe(url) {
  // 先 HEAD：省流量。很多站不支持 HEAD（405/501/403），退回 GET。
  let res = await request(url, { method: 'HEAD', headers: { 'user-agent': UA }, timeout: 12000 });
  if (!res.ok || res.status === 405 || res.status === 501 || res.status === 403) {
    const get = await request(url, { method: 'GET', headers: { 'user-agent': UA }, timeout: 15000 });
    if (get.ok || !res.ok) res = get;
  }
  const verdict = classify(res);
  return { url, httpStatus: res.status, error: res.error ?? null, ...verdict };
}

async function main() {
  const { entries } = await loadEntries();
  const targets = entries
    .map((e) => ({ id: e.id, url: entryUrl(e) }))
    .filter((t) => t.url);

  info(`巡检 ${targets.length} 个链接（并发 8）…`);

  const results = await pool(targets, 8, async (t) => {
    const r = await probe(t.url);
    const mark = r.status === 'ok' ? '.' : r.status === 'blocked' ? 'o' : 'x';
    process.stdout.write(mark);
    return { id: t.id, ...r };
  });
  process.stdout.write('\n\n');

  const byId = {};
  const buckets = { ok: [], blocked: [], dead: [], unknown: [] };
  for (const r of results) {
    byId[r.id] = { url: r.url, status: r.status, httpStatus: r.httpStatus, error: r.error };
    buckets[r.status].push(r);
  }

  const payload = {
    checkedAt: new Date().toISOString(),
    summary: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])),
    results: byId,
  };
  await writeFile(LINK_STATUS_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  ok(`结果已写入 data/link-status.json：${payload.summary.ok} 正常 · ${payload.summary.blocked} 被拦 · ${payload.summary.dead} 死链 · ${payload.summary.unknown} 待定`);

  if (buckets.dead.length > 0) {
    console.log('');
    bad(`确认失效的链接（${buckets.dead.length}）：`);
    for (const r of buckets.dead) console.log(`  ${r.id}  ${r.url}  ${r.error ?? `HTTP ${r.httpStatus}`}`);
    console.log('');
    console.log(dim('  这些要么修 URL，要么把条目标记 archived，要么删除。'));
    process.exit(1);
  }

  if (buckets.blocked.length > 0 || buckets.unknown.length > 0) {
    const note = buckets.blocked.length + buckets.unknown.length;
    console.log('');
    warn(`${note} 个链接无法用脚本判定（多为 WAF 拦截或临时故障），不计为失败。需要人点开确认：`);
    for (const r of [...buckets.blocked, ...buckets.unknown].slice(0, 15)) {
      console.log(dim(`  ${r.id}  HTTP ${r.httpStatus || '-'}  ${r.url}`));
    }
    if (note > 15) console.log(dim(`  …另有 ${note - 15} 个，见 data/link-status.json`));
  }
}

main().catch((err) => {
  bad(`巡检出错：${err.stack ?? err.message}`);
  process.exit(1);
});
