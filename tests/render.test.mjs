import assert from 'node:assert/strict';
import { test } from 'node:test';

import { compareEntries, entryUrl, summarize } from '../scripts/lib/dataset.mjs';
import { anchor, renderCatalog, renderTable } from '../scripts/lib/render.mjs';

const mk = (id, data) => ({ id, file: `${id}.yml`, data });

test('锚点算法与 GitHub 一致：中文保留、空格转连字符、标点丢弃', () => {
  assert.equal(anchor('招标公告与交易数据'), '招标公告与交易数据');
  // 「BIM / CAD 与图纸」→ 两个空格各转一个 -，/ 丢弃
  assert.equal(anchor('BIM / CAD 与图纸'), 'bim--cad-与图纸');
  // 顿号属于标点，丢弃
  assert.equal(anchor('数据、AI 与检索'), '数据ai-与检索');
  assert.equal(anchor('标准、数据集与学习资源'), '标准数据集与学习资源');
});

test('排序：精选优先 > order 小 > 名称拼音序', () => {
  const list = [
    mk('a', { name: 'Alpha', order: 10 }),
    mk('b', { name: 'Beta', order: 100, featured: true }),
    mk('c', { name: 'Gamma', order: 200 }),
    mk('d', { name: 'Delta', order: 10 }),
  ];
  const sorted = [...list].sort(compareEntries).map((e) => e.data.name);
  // Beta 靠 featured 压过 order；Alpha/Delta 同为 order 10，按名称排；Gamma 最后
  assert.deepEqual(sorted, ['Beta', 'Alpha', 'Delta', 'Gamma']);
});

test('order 缺省按 100 处理，不会排到未设置项前面', () => {
  const list = [mk('a', { name: 'A' }), mk('b', { name: 'B', order: 200 })];
  assert.equal([...list].sort(compareEntries)[0].data.name, 'A');
});

test('链接优先级：homepage > GitHub 仓库 > 无', () => {
  assert.equal(entryUrl(mk('x', { homepage: 'https://a.example', repo: 'o/r' })), 'https://a.example');
  assert.equal(entryUrl(mk('x', { homepage: null, repo: 'o/r' })), 'https://github.com/o/r');
  assert.equal(entryUrl(mk('x', { homepage: null, repo: null })), null);
});

test('表格里的竖线与换行会被转义，不破坏 markdown 结构', () => {
  const rows = [
    mk('x', {
      name: 'A',
      kind: 'library',
      description: '支持 a | b\n第二行',
      homepage: 'https://a.example',
    }),
  ];
  const lines = renderTable(rows).split('\n');
  // 描述里的换行若没被处理，这里会多出一行
  assert.equal(lines.length, 3);
  assert.ok(lines[2].includes('a \\| b'));
});

test('归档条目在表格里带标注', () => {
  const rows = [mk('x', { name: 'A', kind: 'app', description: '描述够长的测试条目内容', archived: true })];
  assert.match(renderTable(rows), /A（已归档）/);
});

test('分类目录里空分类显示「待补充」而不是 0', () => {
  const md = renderCatalog([{ cat: { slug: 'x', name: '空分类', desc: '说明' }, entries: [] }]);
  assert.match(md, /待补充/);
  assert.doesNotMatch(md, /\| 0 \|/);
});

test('统计能正确聚合类型与语言', () => {
  const s = summarize([
    mk('a', { kind: 'library', language: 'Python' }),
    mk('b', { kind: 'library', language: 'Python' }),
    mk('c', { kind: 'app', language: 'C++' }),
    mk('d', { kind: 'spec', language: null }),
  ]);
  assert.equal(s.total, 4);
  assert.deepEqual(s.kinds[0], ['library', 2]);
  assert.equal(s.languages.length, 2); // null 不计入
});
