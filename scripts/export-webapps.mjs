#!/usr/bin/env node
/**
 * 把软件类条目导出成「站点条目」格式，方便拿去做导航页、小程序或浏览器扩展的数据源。
 *
 * 为什么需要人工过一遍：导航类产品收的是「浏览器里点开就能用的站点」，而这里很多是
 * 需要本地安装的桌面软件或命令行工具。脚本只做格式转换，不做「适不适合当站点」的判断。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { entryUrl, loadEntries } from './lib/dataset.mjs';
import { DIST_DIR } from './lib/paths.mjs';
import { dim, info, ok, warn } from './lib/log.mjs';

const EXPORTABLE_KINDS = new Set(['app', 'service', 'cli']);
const DESC_LIMIT = 60;

function trimDesc(text) {
  const s = String(text ?? '').replace(/\s+/g, ' ');
  return s.length > DESC_LIMIT ? `${s.slice(0, DESC_LIMIT - 1)}…` : s;
}

async function main() {
  const { entries } = await loadEntries();

  const sites = entries
    .filter((e) => EXPORTABLE_KINDS.has(e.data.kind))
    .map((e) => ({ entry: e, url: entryUrl(e) }))
    .filter((x) => x.url)
    .map(({ entry, url }) => ({
      category: 'tools',
      name: entry.data.name,
      url,
      desc: trimDesc(entry.data.description),
      alias: entry.data.tags ?? [],
      region: 'national',
      regionName: null,
      searchUrl: null,
    }));

  const skipped = entries.filter((e) => !EXPORTABLE_KINDS.has(e.data.kind)).length;

  const payload = {
    _comment:
      '由 awesome-bidding 的 npm run export:webapps 生成。这是通用「站点条目」格式，不是任何具体产品的私有格式；合并进你自己的数据前请人工过一遍。',
    generatedAt: new Date().toISOString(),
    source: 'awesome-bidding',
    contentLicense: 'CC0-1.0',
    categories: [{ slug: 'tools', name: '工具软件', sortOrder: 70 }],
    sites,
  };

  await mkdir(DIST_DIR, { recursive: true });
  const file = path.join(DIST_DIR, 'webapps.json');
  await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  ok(`已导出 ${sites.length} 个软件类条目 → dist/webapps.json`);
  info(`另有 ${skipped} 个库/数据集/规范类条目不导出（站点形态收的是能直接打开的页面）。`);
  console.log('');
  console.log(dim('  合并前请人工确认：'));
  console.log(dim('  1. 是否真的能在浏览器里直接用（桌面软件要挑官网下载页）'));
  console.log(dim('  2. URL 是否与你已有条目重复（按去掉协议与 www 的规范化地址判重）'));
}

main().catch((err) => {
  warn(`导出失败：${err.message}`);
  process.exit(1);
});
