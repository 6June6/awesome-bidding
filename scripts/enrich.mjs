#!/usr/bin/env node
/**
 * 拉取 GitHub 元数据（star / 许可 / 归档 / 最后推送）。
 *
 * 只写 data/metrics.json 这个缓存，绝不回写条目——条目里的 license 是维护者的判断
 * （比如「Apache-2.0（附加条款）」），API 只会返回 Apache-2.0，自动覆盖会把判断抹掉。
 * 两边不一致时打印出来，由人决定改哪边。
 *
 * 无 token 时限速 60 次/小时，45 个条目跑得动；条目多了请配 GITHUB_TOKEN。
 */
import { writeFile } from 'node:fs/promises';

import { loadEntries, loadMetrics } from './lib/dataset.mjs';
import { request, sleep } from './lib/http.mjs';
import { METRICS_FILE } from './lib/paths.mjs';
import { bad, dim, info, ok, warn } from './lib/log.mjs';

const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';
const CONCURRENCY = TOKEN ? 6 : 2;

function authHeaders() {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'awesome-bidding-enrich',
    'x-github-api-version': '2022-11-28',
  };
  if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;
  return headers;
}

async function fetchRepo(repo) {
  const url = `https://api.github.com/repos/${repo}`;
  let res = await request(url, { wantJson: true, headers: authHeaders(), timeout: 20000 });

  // 限流：等一会儿再来一次，别直接判失败
  if (res.status === 403 || res.status === 429) {
    await sleep(3000);
    res = await request(url, { wantJson: true, headers: authHeaders(), timeout: 20000 });
  }
  return res;
}

async function main() {
  const { entries } = await loadEntries();
  const previous = await loadMetrics();
  const onlyMissing = process.argv.includes('--missing');

  let withRepo = entries.filter((e) => e.data.repo);
  if (onlyMissing) {
    withRepo = withRepo.filter((e) => !previous.repos?.[e.data.repo]);
  }

  if (!TOKEN) warn('未设置 GITHUB_TOKEN，走匿名限速（60 次/小时）。条目多时会中途限流。');
  if (withRepo.length === 0) {
    ok('所有条目都已有元数据缓存，没有需要抓取的。');
    return;
  }
  info(`开始抓取 ${withRepo.length} 个仓库的元数据${onlyMissing ? '（增量模式，只补缺失的）' : ''}…`);

  // 从旧缓存起手：增量模式下不会丢掉没被重抓的仓库，失败时也自然沿用旧值
  const repos = { ...(previous.repos ?? {}) };
  const problems = [];
  const drift = [];

  for (const entry of withRepo) {
    const { repo, license: declared } = entry.data;
    const res = await fetchRepo(repo);

    if (!res.ok || !res.json) {
      problems.push(`${repo}：请求失败（${res.error ?? `HTTP ${res.status}`}），沿用上次缓存`);
      if (previous.repos?.[repo]) repos[repo] = previous.repos[repo];
      continue;
    }
    if (res.status === 404) {
      problems.push(`${repo}：GitHub 返回 404，仓库可能已改名或删除，请更新条目`);
      continue;
    }

    const data = res.json;
    repos[repo] = {
      stars: data.stargazers_count ?? null,
      forks: data.forks_count ?? null,
      license: data.license?.spdx_id ?? null,
      archived: data.archived === true,
      language: data.language ?? null,
      pushedAt: data.pushed_at ? data.pushed_at.slice(0, 10) : null,
      homepage: data.homepage || null,
    };

    const apiLicense = repos[repo].license;
    // NOASSERTION = GitHub 认不出许可文件（常见于自定义条款、双许可、附加条件），
    // 这种情况条目的手工判断比 API 更准，不报差异。
    const apiUsable = apiLicense && apiLicense !== 'NOASSERTION';
    if (
      apiUsable &&
      declared &&
      !['unknown', 'proprietary'].includes(declared) &&
      !declared.toLowerCase().includes(apiLicense.toLowerCase())
    ) {
      drift.push(`${repo}：条目写的是「${declared}」，GitHub 报告「${apiLicense}」`);
    }
    if (repos[repo].archived && !entry.data.archived) {
      drift.push(`${repo}：仓库已归档，条目建议加 archived: true`);
    }
  }

  const payload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    source: 'api.github.com',
    repos,
  };
  await writeFile(METRICS_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  ok(`已写入 data/metrics.json（${Object.keys(repos).length} 个仓库）。`);
  if (problems.length > 0) {
    console.log('');
    warn(`有 ${problems.length} 个仓库没抓到：`);
    for (const p of problems) console.log(dim(`  - ${p}`));
  }
  if (drift.length > 0) {
    console.log('');
    warn(`有 ${drift.length} 处与条目记录不一致（需要人工判断，脚本不自动改）：`);
    for (const d of drift) console.log(dim(`  - ${d}`));
  }
  if (problems.length > 0 || drift.length > 0) {
    console.log('');
    console.log(dim('  抓取失败不影响构建；不一致项请手工核对后改 data/entries/。'));
  }
}

main().catch((err) => {
  bad(`enrich 失败：${err.stack ?? err.message}`);
  console.log(dim('  已有缓存不会被破坏，直接重跑即可。'));
  process.exit(1);
});
