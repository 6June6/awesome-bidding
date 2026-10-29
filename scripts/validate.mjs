#!/usr/bin/env node
/**
 * 全量校验：结构（JSON Schema）+ 业务规则 + 唯一性。
 *
 * 设计原则：错误必须能让人直接照做——每条报错都带文件路径和「怎么改」。
 * 本地跑 `npm run validate`，CI 在 PR 上跑同一个命令，两边结论必须一致。
 */
import { loadCategories, loadEntries } from './lib/dataset.mjs';
import { createValidator } from './lib/schema.mjs';
import { bad, bold, dim, finish, info, ok, warn } from './lib/log.mjs';

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const TODAY = new Date().toISOString().slice(0, 10);

function normUrl(raw) {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    const pathname = u.pathname.replace(/\/+$/, '');
    return `${host}${pathname}${u.search}`;
  } catch {
    return null;
  }
}

function checkCategories(categories, errors, warnings) {
  if (categories.length === 0) {
    errors.push('data/categories.yml 里一个分类都没有。');
    return;
  }
  const seenSlug = new Map();
  const seenOrder = new Map();

  categories.forEach((cat, i) => {
    const at = `data/categories.yml 第 ${i + 1} 项`;
    if (!cat.slug) errors.push(`${at}：缺少 slug。`);
    else if (!ID_PATTERN.test(cat.slug)) errors.push(`${at}：slug「${cat.slug}」只能用小写字母、数字和连字符。`);
    if (!cat.name) errors.push(`${at}：缺少 name。`);
    if (!cat.desc) errors.push(`${at}：缺少 desc（一句话说明这个分类收什么）。`);
    if (typeof cat.order !== 'number') errors.push(`${at}：缺少数字类型的 order。`);

    if (cat.slug) {
      if (seenSlug.has(cat.slug)) errors.push(`${at}：slug「${cat.slug}」与第 ${seenSlug.get(cat.slug)} 项重复。`);
      else seenSlug.set(cat.slug, i + 1);
    }
    if (typeof cat.order === 'number') {
      if (seenOrder.has(cat.order)) {
        warnings.push(`${at}：order ${cat.order} 与第 ${seenOrder.get(cat.order)} 项相同，展示顺序会不稳定。`);
      } else seenOrder.set(cat.order, i + 1);
    }
  });
}

function checkEntry(entry, ctx) {
  const { errors, warnings, categorySlugs } = ctx;
  const { id, file, data } = entry;
  const at = `data/entries/${file}`;

  if (!ID_PATTERN.test(id)) {
    errors.push(`${at}：文件名「${id}.yml」不合规。id 只能用小写字母、数字和连字符，例如 mozilla--pdf-js.yml。`);
  }

  for (const msg of ctx.validate(data)) errors.push(`${at}：${msg}`);

  if (data.category && !categorySlugs.has(data.category)) {
    errors.push(
      `${at}：分类「${data.category}」不存在。现有分类：${[...categorySlugs].join('、')}。新增分类请先提 issue 讨论（见 docs/taxonomy.md）。`,
    );
  }

  if (!data.repo && !data.homepage) {
    errors.push(`${at}：repo 和 homepage 至少要填一个，否则读者找不到项目在哪。`);
  }

  if (data.repo && data.homepage && normUrl(data.homepage) === normUrl(`https://github.com/${data.repo}`)) {
    warnings.push(`${at}：homepage 与 repo 指向同一地址，homepage 可以留空（会默认链到 GitHub）。`);
  }

  if (data.added && data.added > TODAY) {
    errors.push(`${at}：added 是未来日期（${data.added}），填收录当天的日期。`);
  }

  if (!data.use_cases?.length) {
    warnings.push(`${at}：没写 use_cases。补两三条具体场景能显著提高被发现和采用的机会。`);
  }
  if (!data.tags?.length) {
    warnings.push(`${at}：没写 tags，检索时不容易被搜到。`);
  }
}

function checkDuplicates(entries, errors) {
  const byRepo = new Map();
  const byUrl = new Map();
  const byName = new Map();

  for (const e of entries) {
    const at = `data/entries/${e.file}`;
    const repo = e.data.repo ? e.data.repo.toLowerCase() : null;
    const url = normUrl(e.data.homepage);
    const name = e.data.name ? String(e.data.name).trim().toLowerCase() : null;

    if (repo) {
      if (byRepo.has(repo)) errors.push(`${at}：仓库 ${e.data.repo} 已被 ${byRepo.get(repo)} 收录，同一条目不要重复提交。`);
      else byRepo.set(repo, at);
    }
    if (url) {
      if (byUrl.has(url)) errors.push(`${at}：主页 ${e.data.homepage} 与 ${byUrl.get(url)} 重复。`);
      else byUrl.set(url, at);
    }
    if (name) {
      if (byName.has(name)) errors.push(`${at}：名称「${e.data.name}」与 ${byName.get(name)} 重复。同名请加限定，如「PDF.js」。`);
      else byName.set(name, at);
    }
  }
}

async function main() {
  const errors = [];
  const warnings = [];

  const categories = await loadCategories();
  checkCategories(categories, errors, warnings);
  const categorySlugs = new Set(categories.map((c) => c.slug));

  const { entries, errors: parseErrors } = await loadEntries();
  errors.push(...parseErrors);

  const validate = await createValidator();
  for (const entry of entries) checkEntry(entry, { errors, warnings, categorySlugs, validate });
  checkDuplicates(entries, errors);

  // 分类空置不算错误，但要让维护者看见
  for (const cat of categories) {
    const n = entries.filter((e) => e.data.category === cat.slug).length;
    if (n === 0) warnings.push(`分类「${cat.name}」（${cat.slug}）目前没有条目，README 上会显示「待补充」。`);
  }

  const archived = entries.filter((e) => e.data.archived).length;
  info(`扫描 ${bold(entries.length)} 个条目、${bold(categories.length)} 个分类${archived ? `，其中 ${archived} 个标记为已归档` : ''}。`);

  if (errors.length === 0) ok(`结构校验通过（${entries.length} 个条目）。`);
  if (errors.length === 0 && warnings.length > 0) {
    console.log(dim(`\n有 ${warnings.length} 条提醒，不影响通过：\n`));
  }
  finish(errors, errors.length === 0 ? warnings : []);
}

main().catch((err) => {
  bad(`校验脚本自身出错：${err.stack ?? err.message}`);
  process.exit(2);
});
