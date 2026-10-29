#!/usr/bin/env node
/**
 * 交互式新建条目：回答几个问题，生成一个符合规范的 YAML 文件。
 *
 * 刻意不做「猜」——拿不准的字段一律留空或让用户确认，避免生成一份看起来对、
 * 实际需要回头改半天的文件。
 */
import { access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';

import { loadCategories } from './lib/dataset.mjs';
import { KIND_LABELS } from './lib/dataset.mjs';
import { ENTRIES_DIR } from './lib/paths.mjs';
import { bad, bold, dim, info, ok, warn } from './lib/log.mjs';

const KINDS = Object.keys(KIND_LABELS);
const PLATFORMS = ['windows', 'macos', 'linux', 'web', 'android', 'ios', 'server', 'cli'];

/** 值里出现这些字符就必须加引号，否则 YAML 会解析成别的东西。 */
function quote(value) {
  const s = String(value ?? '').trim();
  if (s === '') return 'null';
  return /^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5 \-.+/]*$/.test(s) ? s : JSON.stringify(s);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitList(text) {
  return String(text)
    .split(/[,，;；]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  if (!process.stdin.isTTY) {
    bad('这是交互式命令，需要在终端里运行。');
    console.log('  非交互场景请复制 data/entries/_template.yml 手工填写。');
    process.exit(1);
  }

  const categories = await loadCategories();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q, fallback) => {
    const hint = fallback ? dim(`[${fallback}]`) : '';
    const answer = (await rl.question(`${q}${hint} `)).trim();
    return answer || fallback || '';
  };

  console.log(bold('\n新建条目 —— 回车接受方括号里的默认值，Ctrl+C 随时退出\n'));

  const name = await ask('项目名称：');
  if (!name) {
    rl.close();
    bad('名称不能为空。');
    process.exit(1);
  }

  const repoRaw = await ask('GitHub 仓库（owner/repo，非 GitHub 项目直接回车）：');
  const repo = /^[\w.-]+\/[\w.-]+$/.test(repoRaw) ? repoRaw : null;
  if (repoRaw && !repo) warn(`「${repoRaw}」不像 owner/repo 格式，已忽略，记得把地址填到 homepage。`);

  const homepage = await ask('官方主页 / 文档站（可回车跳过）：');

  console.log('\n可选分类：');
  categories.forEach((c, i) => console.log(`  ${String(i + 1).padStart(2)}. ${c.name} ${dim(`(${c.slug})`)}`));
  const catIndex = Number(await ask('分类编号：', '1')) - 1;
  const category = categories[catIndex]?.slug;
  if (!category) {
    rl.close();
    bad('分类编号超出范围。');
    process.exit(1);
  }

  console.log('\n可选类型：' + KINDS.map((k, i) => `${i + 1}=${KIND_LABELS[k]}`).join('  '));
  const kind = KINDS[Number(await ask('类型编号：', '1')) - 1];
  if (!kind) {
    rl.close();
    bad('类型编号超出范围。');
    process.exit(1);
  }

  const license = await ask('许可协议（SPDX，如 MIT / Apache-2.0；不确定写 unknown）：', 'unknown');
  const language = await ask('主要语言（如 Python，可回车跳过）：');
  const platforms = splitList(await ask(`平台（逗号分隔，可选 ${PLATFORMS.join('/')}）：`)).filter((p) =>
    PLATFORMS.includes(p),
  );

  console.log(dim('\n描述要写清「它是什么 + 在招投标/工程里解决什么问题」，12~120 字，别抄营销词。'));
  const description = await ask('一句话描述：');

  const tags = splitList(await ask('标签（逗号分隔，2~6 个）：'));
  const useCases = splitList(await ask('使用场景（逗号或分号分隔，可回车跳过）：'));
  const addedBy = await ask('你的 GitHub handle：', '@');

  rl.close();

  const id = repo ? repo.toLowerCase().replace('/', '--') : slugify(name);
  if (!id) {
    bad('无法从名称生成合法 id（需要 ASCII 文件名）。请手填 data/entries/<slug>.yml。');
    process.exit(1);
  }
  const file = path.join(ENTRIES_DIR, `${id}.yml`);

  try {
    await access(file);
    bad(`data/entries/${id}.yml 已存在，可能已经收录过了。`);
    process.exit(1);
  } catch {
    /* 不存在才继续 */
  }

  const lines = [
    `name: ${quote(name)}`,
    `category: ${category}`,
    `kind: ${kind}`,
    `repo: ${repo ?? 'null'}`,
    `homepage: ${homepage ? quote(homepage) : 'null'}`,
    `license: ${quote(license)}`,
    `language: ${language ? quote(language) : 'null'}`,
    `platform: [${platforms.join(', ')}]`,
    `description: ${quote(description)}`,
    `tags: [${tags.map(quote).join(', ')}]`,
  ];
  if (useCases.length > 0) {
    lines.push('use_cases:');
    for (const u of useCases) lines.push(`  - ${quote(u)}`);
  }
  lines.push('featured: false');
  lines.push('order: 100');
  lines.push(`added: ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`added_by: ${quote(addedBy)}`);
  lines.push('');

  await writeFile(file, lines.join('\n'), 'utf8');

  ok(`已创建 data/entries/${id}.yml`);
  info('接下来：');
  console.log(dim('  npm run validate   # 结构 + 业务规则'));
  console.log(dim('  npm run build      # 更新 README 与分类页'));
  console.log(dim('  git add . && git commit -m "add: ' + name + '"'));
}

main().catch((err) => {
  bad(`脚手架出错：${err.message}`);
  process.exit(2);
});
