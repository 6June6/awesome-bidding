import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createValidator } from '../scripts/lib/schema.mjs';

const base = {
  name: '测试项目',
  category: 'doc-parse',
  kind: 'library',
  repo: 'owner/repo',
  homepage: null,
  license: 'MIT',
  language: 'Python',
  platform: ['linux', 'macos'],
  description: '这是一个长度合规的测试描述，用来验证结构校验能正常通过。',
  tags: ['PDF', '测试'],
  use_cases: ['验证 schema 能跑通'],
  featured: false,
  order: 100,
  added: '2026-10-29',
  added_by: '@tester',
};

test('合法条目通过校验', async () => {
  const validate = await createValidator();
  assert.deepEqual(validate(base), []);
});

test('缺必填字段会被指出，并给出中文字段名', async () => {
  const validate = await createValidator();
  const { name, ...withoutName } = base;
  const errors = validate(withoutName);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /名称 name.*必填/);
});

test('字段拼错会报「不在 schema 里」，而不是静默忽略', async () => {
  const validate = await createValidator();
  const errors = validate({ ...base, discrption: '拼错的字段' });
  assert.ok(errors.some((e) => e.includes('discrption') && e.includes('拼错')));
});

test('kind 只接受枚举值', async () => {
  const validate = await createValidator();
  const errors = validate({ ...base, kind: 'framework' });
  assert.ok(errors.some((e) => e.includes('类型 kind') && e.includes('不合法')));
});

test('描述过短会被拦下', async () => {
  const validate = await createValidator();
  const errors = validate({ ...base, description: '太短' });
  assert.ok(errors.some((e) => e.includes('太短')));
});

test('repo 与 homepage 都允许为 null（业务规则要求至少一个，由 validate.mjs 检查）', async () => {
  const validate = await createValidator();
  assert.deepEqual(validate({ ...base, repo: null, homepage: null }), []);
});

test('repo 格式错误会被拦下', async () => {
  const validate = await createValidator();
  const errors = validate({ ...base, repo: 'https://github.com/owner/repo' });
  assert.ok(errors.some((e) => e.includes('格式不对')));
});

test('unknown 是合法的许可证占位值', async () => {
  const validate = await createValidator();
  assert.deepEqual(validate({ ...base, license: 'unknown' }), []);
});
