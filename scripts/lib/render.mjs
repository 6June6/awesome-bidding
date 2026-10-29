import { KIND_LABELS, entryUrl } from './dataset.mjs';

/** 表格单元格里的 | 与换行会破坏表格结构，必须转义。 */
function cell(text) {
  return String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

/**
 * 复刻 GitHub 的标题锚点算法（github-slugger）：转小写，空格变连字符，
 * 只保留字母/数字/下划线/连字符，其余标点一律丢弃（中文会被保留）。
 * 目录里的跳转链接只有和它一致，点下去才不会跑偏。
 */
function anchor(name) {
  return [...String(name).toLowerCase()]
    .map((ch) => (ch === ' ' ? '-' : /[\p{L}\p{N}_-]/u.test(ch) ? ch : ''))
    .join('');
}

export { anchor };

/** 「库 · Python · MIT」这样一行小字，信息密度高又不占列。 */
function metaLine(data, metrics) {
  const parts = [KIND_LABELS[data.kind] ?? data.kind];
  if (data.language) parts.push(data.language);
  if (data.license) parts.push(data.license);
  const stars = metrics?.repos?.[data.repo]?.stars;
  if (typeof stars === 'number') parts.push(`★ ${stars >= 1000 ? (stars / 1000).toFixed(1) + 'k' : stars}`);
  return parts.join(' · ');
}

function nameCell(entry, metrics) {
  const { data } = entry;
  const url = entryUrl(entry);
  const label = cell(data.name);
  const link = url ? `[${label}](${url})` : label;
  return data.archived ? `${link}（已归档）` : link;
}

function descCell(entry, withUseCases) {
  const { data } = entry;
  let text = cell(data.description);
  if (withUseCases && data.use_cases?.length) {
    text += `<br><sub>场景：${data.use_cases.map(cell).join('；')}</sub>`;
  }
  return text;
}

/**
 * 渲染一张条目表。
 * @param {Array} entries 已排序
 * @param {{limit?: number, withUseCases?: boolean, metrics?: object}} opts
 */
export function renderTable(entries, opts = {}) {
  const { limit = Infinity, withUseCases = false, metrics } = opts;
  const rows = entries.slice(0, limit);
  const lines = ['| 项目 | 说明 | 信息 |', '| --- | --- | --- |'];
  for (const e of rows) {
    lines.push(`| ${nameCell(e, metrics)} | ${descCell(e, withUseCases)} | ${cell(metaLine(e.data, metrics))} |`);
  }
  return lines.join('\n');
}

/**
 * README 顶部概览行。
 *
 * 注意：这里的时间必须来自数据（metrics.json 的快照日期），不能用「今天」。
 * 构建必须是纯函数——同样的 data/ 任何一天跑都产出同样的文本，否则 build:check
 * 会因为日期变化而误报「产物过期」。
 */
export function renderStats(view, entries, dataDate) {
  const kinds = new Set(entries.map((e) => e.data.kind));
  const langs = new Set(entries.map((e) => e.data.language).filter(Boolean));
  const snapshot = dataDate ? `数据快照 ${dataDate}` : '尚未抓取元数据（`npm run enrich`）';
  return [
    `**${view.total}** 个条目 · **${view.categories.length}** 个分类 · **${kinds.size}** 种类型 · **${langs.size}** 种语言`,
    '',
    `<sub>本页表格由 \`npm run build\` 从 \`data/entries/\` 生成，请勿手改。${snapshot}。</sub>`,
  ].join('\n');
}

/** 分类目录表。 */
export function renderCatalog(sections) {
  const lines = ['| 分类 | 条目 | 覆盖内容 |', '| --- | --- | --- |'];
  for (const { cat, entries } of sections) {
    const count = entries.length === 0 ? '待补充' : String(entries.length);
    const name = `[${cell(cat.name)}](#${anchor(cat.name)})`;
    lines.push(`| ${name} | ${count} | ${cell(cat.desc)} |`);
  }
  return lines.join('\n');
}

/**
 * README 里的分类段：标题 + 简介 + 表格 + 分页提示。
 * 条目超过 limit 时只显示前 limit 条，其余引导到 docs/list/<slug>.md。
 */
export function renderSection(section, opts = {}) {
  const { limit = 12, metrics } = opts;
  const { cat, entries } = section;
  const out = [`### ${cat.name}`, '', `> ${cat.desc}`, ''];

  if (entries.length === 0) {
    out.push('本分类还没有条目。如果你知道合适的项目，欢迎 [提交](CONTRIBUTING.md)。');
    out.push('');
    return out.join('\n');
  }

  out.push(renderTable(entries, { limit, metrics }));
  out.push('');
  const shown = Math.min(limit, entries.length);
  const detail = `[分类详情](docs/list/${cat.slug}.md)`;
  if (entries.length > limit) {
    out.push(`<sub>显示 ${shown} / ${entries.length} 个 · ${detail}</sub>`);
  } else {
    out.push(`<sub>共 ${entries.length} 个 · ${detail}</sub>`);
  }
  out.push('');
  return out.join('\n');
}

/** docs/list/<slug>.md 整页。 */
export function renderCategoryPage(section, siblings, metrics) {
  const { cat, entries } = section;
  const snapshot = metrics?.updatedAt ?? null;
  const out = [
    `# ${cat.name}`,
    '',
    `> ${cat.desc}`,
    '',
    `共 **${entries.length}** 个条目。${cat.en ? `英文名：${cat.en}。` : ''}`,
    '',
  ];
  if (entries.length === 0) {
    out.push('本分类还没有条目，欢迎 [提交](https://github.com/6June6/awesome-bidding/issues/new?template=add-entry.yml)。');
  } else {
    out.push(renderTable(entries, { withUseCases: true, metrics }));
  }
  out.push('');
  out.push('---');
  out.push('');
  out.push(
    '其它分类：' +
      siblings
        .filter((s) => s.cat.slug !== cat.slug)
        .map((s) => `[${s.cat.name}](../list/${s.cat.slug}.md)`)
        .join(' · '),
  );
  out.push('');
  out.push('<sub><a href="../../README.md">返回首页</a></sub>');
  out.push('');
  out.push(
    `<sub>本页由 \`npm run build\` 生成，请勿手改。${snapshot ? `GitHub 元数据快照 ${snapshot}。` : ''}</sub>`,
  );
  out.push('');
  return out.join('\n');
}
