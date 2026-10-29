import { readFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';

import { SCHEMA_FILE } from './paths.mjs';

const FIELD_LABELS = {
  name: '名称 name',
  category: '分类 category',
  kind: '类型 kind',
  repo: '仓库 repo',
  homepage: '主页 homepage',
  license: '许可 license',
  language: '语言 language',
  platform: '平台 platform',
  description: '描述 description',
  tags: '标签 tags',
  use_cases: '使用场景 use_cases',
  featured: '精选 featured',
  order: '排序 order',
  added: '收录日期 added',
  added_by: '提交人 added_by',
  archived: '归档标记 archived',
  notes: '补充说明 notes',
};

function labelFor(instancePath) {
  const key = instancePath.replace(/^\//, '').split('/')[0];
  return FIELD_LABELS[key] ?? (key || '文件根级');
}

/** 把 ajv 的英文报错翻成编辑能直接照做的中文。 */
function translate(error) {
  const where = labelFor(error.instancePath);
  const extra = error.params?.additionalProperty;
  switch (error.keyword) {
    case 'required':
      return `${labelFor('/' + error.params.missingProperty)} 是必填项，不能省略。`;
    case 'additionalProperties':
      return `字段 ${extra} 不在 schema 里，可能是拼错了。可用字段见 schema/entry.schema.json，或 docs/data-format.md。`;
    case 'enum':
      return `${where} 的取值 ${JSON.stringify(error.data)} 不合法，可选：${error.params.allowedValues.join('、')}。`;
    case 'type':
      return `${where} 应该是 ${error.params.type} 类型。`;
    case 'minLength':
      return `${where} 太短了（至少 ${error.params.limit} 个字符）。`;
    case 'maxLength':
      return `${where} 太长了（最多 ${error.params.limit} 个字符）。`;
    case 'pattern':
      return `${where} 格式不对，需匹配 ${error.params.pattern}。`;
    case 'maxItems':
      return `${where} 最多 ${error.params.limit} 项。`;
    case 'uniqueItems':
      return `${where} 里有重复项，去掉重复的。`;
    case 'minimum':
    case 'maximum':
      return `${where} 超出取值范围（${error.params.limit}）。`;
    default:
      return `${where}：${error.message}`;
  }
}

export async function createValidator() {
  const schema = JSON.parse(await readFile(SCHEMA_FILE, 'utf8'));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  /**
   * @returns {string[]} 空数组表示通过
   */
  return function validateEntry(data) {
    if (validate(data)) return [];
    return (validate.errors ?? []).map(translate);
  };
}
