#!/usr/bin/env node
/**
 * 从 data/ 生成一切可读产物：README 的生成区块、docs/list/*.md、dist/index.json。
 *
 * 两条铁律：
 * 1. 人是改 data/ 的，产物永远由脚本覆盖——所以 README 里只允许脚本写在标记内。
 * 2. `--check` 不写入，只比对；PR 上用它拦住「改了数据忘了跑 build」的提交。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { buildView, loadCategories, loadEntries, loadMetrics } from './lib/dataset.mjs';
import { renderCatalog, renderCategoryPage, renderSection, renderStats } from './lib/render.mjs';
import { DIST_DIR, LIST_DIR, README_FILE } from './lib/paths.mjs';
import { bad, dim, finish, green, info, ok } from './lib/log.mjs';

const PREVIEW_LIMIT = 12;
const BLOCKS = ['stats', 'catalog', 'lists'];

function blockPattern(name) {
  return new RegExp(`(<!-- BEGIN GENERATED: ${name} -->)[\\s\\S]*?(<!-- END GENERATED: ${name} -->)`);
}

function fillBlock(text, name, content) {
  const re = blockPattern(name);
  if (!re.test(text)) {
    throw new Error(
      `README.md 里找不到生成区块「${name}」。请保留 <!-- BEGIN GENERATED: ${name} --> 与 <!-- END GENERATED: ${name} --> 两行标记。`,
    );
  }
  return text.replace(re, (_m, head, tail) => `${head}\n${content.trimEnd()}\n${tail}`);
}

function buildIndexJson(view, entries, metrics) {
  const data = {
    generator: 'awesome-bidding',
    // 用数据快照日期而不是构建时刻：同样的 data/ 必须产出同样的文件，
    // 否则 build:check 每次都会因为时间戳变化而报「产物过期」。
    dataUpdatedAt: metrics?.updatedAt ?? null,
    contentLicense: 'CC0-1.0',
    total: view.total,
    categories: view.sections.map(({ cat, entries: list }) => ({
      slug: cat.slug,
      name: cat.name,
      en: cat.en ?? null,
      order: cat.order ?? 999,
      desc: cat.desc,
      count: list.length,
    })),
    entries: entries
      .map((e) => {
        const d = e.data;
        return {
          id: e.id,
          name: d.name,
          category: d.category,
          kind: d.kind,
          repo: d.repo ?? null,
          homepage: d.homepage ?? null,
          url: d.homepage ?? (d.repo ? `https://github.com/${d.repo}` : null),
          license: d.license,
          language: d.language ?? null,
          platform: d.platform ?? [],
          description: d.description,
          tags: d.tags ?? [],
          use_cases: d.use_cases ?? [],
          archived: d.archived === true,
          featured: d.featured === true,
          stars: metrics?.repos?.[d.repo]?.stars ?? null,
          lastPush: metrics?.repos?.[d.repo]?.pushedAt ?? null,
        };
      })
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name, 'zh-Hans-CN')),
  };
  return `${JSON.stringify(data, null, 2)}\n`;
}

async function main() {
  const check = process.argv.includes('--check');

  const categories = await loadCategories();
  const { entries, errors } = await loadEntries();
  if (errors.length > 0) {
    for (const e of errors) bad(e);
    bad('数据有解析错误，先跑 `npm run validate` 修掉再构建。');
    process.exit(1);
  }

  const metrics = await loadMetrics();
  const view = buildView(categories, entries);

  // README
  const original = await readFile(README_FILE, 'utf8');
  let next = fillBlock(original, 'stats', renderStats(view, entries, metrics.updatedAt));
  next = fillBlock(next, 'catalog', renderCatalog(view.sections));
  next = fillBlock(
    next,
    'lists',
    view.sections.map((s) => renderSection(s, { limit: PREVIEW_LIMIT, metrics })).join('\n'),
  );

  // docs/list/*.md
  const pages = new Map();
  for (const section of view.sections) {
    pages.set(path.join(LIST_DIR, `${section.cat.slug}.md`), renderCategoryPage(section, view.sections, metrics));
  }

  // dist/index.json
  const indexJson = buildIndexJson(view, entries, metrics);

  if (check) {
    const stale = [];
    if (next !== original) stale.push('README.md');
    for (const [file, content] of pages) {
      const current = await readFile(file, 'utf8').catch(() => null);
      if (current !== content) stale.push(path.relative(process.cwd(), file));
    }
    const currentIndex = await readFile(path.join(DIST_DIR, 'index.json'), 'utf8').catch(() => null);
    if (currentIndex !== indexJson) stale.push('dist/index.json');

    if (stale.length > 0) {
      console.log('');
      bad(`以下产物与 data/ 不一致：${stale.join('、')}`);
      console.log('');
      console.log('  改了 data/ 里的内容后，请本地跑一次：');
      console.log(dim('    npm run build'));
      console.log('  然后把生成的改动一起提交。');
      console.log('');
      process.exit(1);
    }
    ok('产物与数据一致。');
    return;
  }

  await writeFile(README_FILE, next, 'utf8');
  await mkdir(LIST_DIR, { recursive: true });
  for (const [file, content] of pages) await writeFile(file, content, 'utf8');
  await mkdir(DIST_DIR, { recursive: true });
  await writeFile(path.join(DIST_DIR, 'index.json'), indexJson, 'utf8');

  info(`README 与 ${pages.size} 个分类页已更新。`);
  finish([], []);
  console.log(`${green('→')} dist/index.json 已生成（${view.total} 个条目，供站点/扩展消费）。`);
}

main().catch((err) => {
  bad(`构建失败：${err.stack ?? err.message}`);
  process.exit(2);
});
