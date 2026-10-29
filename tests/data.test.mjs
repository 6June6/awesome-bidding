/**
 * 真实数据的整体门禁。
 *
 * 前面两个测试文件测的是「函数对不对」，这个测「仓库当前状态对不对」——
 * 任何手改数据、忘了 build、加了坏条目的情况都会在这里暴露。
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { buildView, loadCategories, loadEntries } from '../scripts/lib/dataset.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function runScript(file) {
  try {
    const { stdout } = await run(process.execPath, [path.join(ROOT, 'scripts', file)], { cwd: ROOT });
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.code ?? 1, stdout: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

test('data/entries 能全部解析，且没有遗留解析错误', async () => {
  const { entries, errors } = await loadEntries();
  assert.deepEqual(errors, []);
  assert.ok(entries.length > 0, '条目不该为空');
});

test('每个条目的分类都存在', async () => {
  const [categories, { entries }] = await Promise.all([loadCategories(), loadEntries()]);
  const slugs = new Set(categories.map((c) => c.slug));
  const unknown = entries.filter((e) => !slugs.has(e.data.category));
  assert.deepEqual(
    unknown.map((e) => `${e.file}:${e.data.category}`),
    [],
    '有条目指向了不存在的分类',
  );
});

test('分类的 slug 唯一，order 有序可用', async () => {
  const categories = await loadCategories();
  const slugs = categories.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, '存在重复 slug');
  assert.ok(categories.every((c) => typeof c.order === 'number'), '每个分类都要有数字 order');
});

test('每条都能生成一个可点击的链接', async () => {
  const { entries } = await loadEntries();
  const noLink = entries.filter((e) => !e.data.homepage && !e.data.repo);
  assert.deepEqual(noLink.map((e) => e.file), [], '有条目既没有 homepage 也没有 repo');
});

test('validate 脚本对当前数据全绿', async () => {
  const { code, stdout } = await runScript('validate.mjs');
  assert.equal(code, 0, `validate 未通过：\n${stdout}`);
});

test('README 与 docs/list 与数据保持一致（忘了 build 会在这里红）', async () => {
  // 只跑 --check：测试不该写盘改动被测仓库
  try {
    const { stdout } = await run(process.execPath, [path.join(ROOT, 'scripts/build.mjs'), '--check'], { cwd: ROOT });
    assert.ok(stdout.includes('产物与数据一致'), stdout);
  } catch (err) {
    assert.fail(`产物与数据不一致，请本地跑 npm run build：\n${err.stdout ?? ''}${err.stderr ?? ''}`);
  }
});

test('视图组装不会丢条目', async () => {
  const [categories, { entries }] = await Promise.all([loadCategories(), loadEntries()]);
  const view = buildView(categories, entries);
  const rendered = view.sections.reduce((n, s) => n + s.entries.length, 0);
  assert.equal(rendered, entries.length);
});
