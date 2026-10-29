import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

import { CATEGORIES_FILE, ENTRIES_DIR, METRICS_FILE } from './paths.mjs';

export const KIND_LABELS = {
  library: '库',
  app: '应用',
  cli: '命令行',
  service: '服务',
  plugin: '插件',
  skill: '技能',
  dataset: '数据集',
  spec: '规范',
  resource: '资源',
};

const SORT_DEFAULT = 100;

/** 读分类定义。分类是整个站点的骨架，解析失败直接抛（不是「某个条目坏了」这种局部问题）。 */
export async function loadCategories() {
  const text = await readFile(CATEGORIES_FILE, 'utf8');
  const parsed = YAML.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('data/categories.yml 必须是一个 YAML 数组，每项一个分类。');
  }
  return parsed.map((c, i) => ({ ...c, index: i }));
}

/**
 * 读所有条目。单个文件坏掉不抛异常，收集进 errors，交给 validate 统一汇报——
 * 否则一个人提交了坏文件，所有人都看不到其它条目的问题。
 */
export async function loadEntries() {
  let files = [];
  try {
    files = await readdir(ENTRIES_DIR);
  } catch {
    return { entries: [], errors: ['data/entries/ 目录不存在。'] };
  }

  // 下划线开头的文件是模板/草稿，不当作条目（_template.yml 就在这个目录里）
  const ymlFiles = files
    .filter((f) => (f.endsWith('.yml') || f.endsWith('.yaml')) && !f.startsWith('_'))
    .sort();
  const errors = [];
  const entries = [];

  for (const file of ymlFiles) {
    const id = file.replace(/\.ya?ml$/, '');
    const full = path.join(ENTRIES_DIR, file);
    const text = await readFile(full, 'utf8');
    let data;
    try {
      data = YAML.parse(text);
    } catch (err) {
      errors.push(`data/entries/${file}：YAML 解析失败 —— ${err.message.split('\n')[0]}`);
      continue;
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      errors.push(`data/entries/${file}：文件内容必须是一个对象（key: value 结构）。`);
      continue;
    }
    entries.push({ id, file, data });
  }

  return { entries, errors };
}

export async function loadMetrics() {
  try {
    return JSON.parse(await readFile(METRICS_FILE, 'utf8'));
  } catch {
    return { updatedAt: null, repos: {} };
  }
}

/** 排序：编辑精选优先 → order 小的优先 → 名称拼音序。 */
export function compareEntries(a, b) {
  const fa = a.data.featured ? 1 : 0;
  const fb = b.data.featured ? 1 : 0;
  if (fa !== fb) return fb - fa;
  const oa = a.data.order ?? SORT_DEFAULT;
  const ob = b.data.order ?? SORT_DEFAULT;
  if (oa !== ob) return oa - ob;
  return String(a.data.name).localeCompare(String(b.data.name), 'zh-Hans-CN');
}

/** 组装成渲染用的视图：分类按 order 排，分类内条目已排序。 */
export function buildView(categories, entries) {
  const sortedCats = [...categories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const byCat = new Map(sortedCats.map((c) => [c.slug, []]));
  for (const e of entries) {
    const bucket = byCat.get(e.data.category);
    if (bucket) bucket.push(e);
  }
  for (const list of byCat.values()) list.sort(compareEntries);

  const sections = sortedCats.map((cat) => ({
    cat,
    entries: byCat.get(cat.slug) ?? [],
  }));

  return { sections, total: entries.length, categories: sortedCats };
}

/** 条目对外链接：主页优先，其次 GitHub 仓库。 */
export function entryUrl(entry) {
  const { homepage, repo } = entry.data;
  if (homepage) return homepage;
  if (repo) return `https://github.com/${repo}`;
  return null;
}

/** 统计各语言/许可/类型分布，用于 README 概览。 */
export function summarize(entries) {
  const count = (fn) => {
    const map = new Map();
    for (const e of entries) {
      const key = fn(e.data);
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  };

  return {
    total: entries.length,
    kinds: count((d) => d.kind),
    languages: count((d) => d.language),
    licenses: count((d) => d.license),
    featured: entries.filter((e) => e.data.featured).length,
  };
}
