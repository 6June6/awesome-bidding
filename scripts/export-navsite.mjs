#!/usr/bin/env node
/**
 * 导出成 nav-site 的站点数据格式，方便把开源工具补进导航站的「工具软件」分类。
 *
 * 为什么需要人工过一遍：导航站收的是「浏览器里点开就能用的站点」，而这里很多是
 * 需要本地安装的桌面软件或命令行工具。脚本只做格式转换，不做「适不适合上导航站」的判断。
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
      '由 awesome-bidding 的 npm run export:navsite 生成。仅供人工挑选后并入 nav-site 的 scripts/data/nav-sites.json，不要直接覆盖。',
    generatedAt: new Date().toISOString(),
    source: 'awesome-bidding',
    categories: [{ slug: 'tools', name: '工具软件', sortOrder: 70 }],
    sites,
  };

  await mkdir(DIST_DIR, { recursive: true });
  const file = path.join(DIST_DIR, 'nav-sites-export.json');
  await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  ok(`已导出 ${sites.length} 个软件类条目 → dist/nav-sites-export.json`);
  info(`另有 ${skipped} 个库/数据集/规范类条目不导出（导航站收录的是能直接打开的站点）。`);
  console.log('');
  console.log(dim('  合并前请人工确认：'));
  console.log(dim('  1. 是否真的能在浏览器里直接用（桌面软件要挑官网下载页）'));
  console.log(dim('  2. URL 是否与 nav-site 已有条目重复（nav-site 按 url_norm 判重）'));
}

main().catch((err) => {
  warn(`导出失败：${err.message}`);
  process.exit(1);
});
