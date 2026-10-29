# 贡献指南

谢谢愿意帮忙。这个仓库的价值不在「条目多」，而在**每条都能让人判断出「这东西跟我有没有关系」**。所以规则都围绕这一点。

先读这三件事，能省下你一次返工：

1. 一条目一文件，**不要编辑 README 或 `docs/list/`**（它们是生成的）。
2. 描述必须写「在招投标/工程场景里解决什么问题」，不要复述项目自己的宣传语。
3. 提交前跑 `npm run validate && npm run build`，CI 跑的是同一套检查。

---

## 三种提交方式

### 方式一：填表单（不会 Git 也能提）

[新增条目表单](https://github.com/6June6/awesome-bidding/issues/new?template=add-entry.yml)

表单是结构化的，填完就是一个可用的推荐。维护者会替你转成数据文件并合并，你的名字会记在 `added_by` 里。

### 方式二：提 PR（推荐）

```bash
# 1. fork + clone 后
npm install

# 2. 先生成文件（交互式，推荐）
npm run new

#    或复制模板手工填
cp data/entries/_template.yml data/entries/<owner>--<repo>.yml

# 3. 自检
npm run validate      # 结构 + 业务规则 + 查重
npm run build         # 更新 README 与 docs/list

# 4. 提交（数据文件 + 生成的产物一起提交）
git add data/entries/<owner>--<repo>.yml README.md docs/list dist/index.json
git commit -m "add: <项目名>"
```

**一个 PR 只加一个条目。** 想推荐五个？开五个 PR 或一个 issue 列表——这样每个条目能被独立评审，坏的不会拖累好的。

### 方式三：只报问题

- [报失效链接](https://github.com/6June6/awesome-bidding/issues/new?template=broken-link.yml)
- [提议新分类](https://github.com/6June6/awesome-bidding/issues/new?template=suggest-category.yml)
- 发现安全隐患（供应链投毒、恶意代码）：见 [SECURITY.md](SECURITY.md)，**不要开公开 issue**。

---

## 文件名怎么起

文件名就是条目 id，也是唯一的，格式只有两种：

| 情况 | 规则 | 例子 |
| --- | --- | --- |
| GitHub 项目 | `owner--repo.yml`，全小写 | `mozilla--pdf-js.yml` → id `mozilla--pdf-js` |
| 非 GitHub（Gitee、GitLab、自建、标准文档） | 项目 slug，全小写 | `ifc-standard.yml` |

只允许小写字母、数字、连字符。仓库名里有 `.` 的保留（`mwilliamson--mammoth-js.yml` 除外——`.` 换成 `-`）。

---

## 字段速查

完整说明见 [docs/data-format.md](docs/data-format.md)，结构定义见 [`schema/entry.schema.json`](schema/entry.schema.json)（在 VS Code 里有自动补全）。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 展示名。有中文名用中文名，别加「官方」「最强」 |
| `category` | 是 | 必须是 [已有分类](data/categories.yml) 的 slug，一条只归一个 |
| `kind` | 是 | `library` / `app` / `cli` / `service` / `plugin` / `skill` / `dataset` / `spec` / `resource` |
| `description` | 是 | 12~120 字，见下节写法 |
| `license` | 是 | SPDX 标识；拿不准写 `unknown`；闭源写 `proprietary` |
| `repo` | 二选一 | `owner/repo`，仅限 GitHub |
| `homepage` | 二选一 | 项目自己的主页/文档站/下载页 |
| `language` | 否 | 主要实现语言 |
| `platform` | 否 | `windows` `macos` `linux` `web` `android` `ios` `server` `cli` |
| `tags` | 否 | 2~6 个检索词，中英文都行 |
| `use_cases` | 否 | 具体场景，强烈建议写 |
| `featured` | 否 | 只由维护者设置，PR 里请留 `false` |
| `order` | 否 | 同分类排序权重，默认 100，越小越前 |
| `added` | 否 | 当天日期 |
| `added_by` | 否 | 你的 GitHub handle |
| `archived` | 否 | 上游已归档但仍值得参考 |
| `notes` | 否 | 坑点、许可限制、实测结论 |

---

## 描述怎么写

这是唯一需要动脑子、也最容易被退回的地方。判断标准：**一个懂业务但不懂这个项目的人，读完能不能决定要不要点进去？**

写清两件事：**它是什么** + **它能替代你现在手工做的哪一步**。

| | 写法 | 为什么 |
| --- | --- | --- |
| 好 | 能拿到每个字符的坐标、字号与表格线，按位置还原版面；评标办法、报价表这类靠排版传意的页面必须用它。 | 说了能力、说了为什么需要它 |
| 好 | 给扫描版 PDF 补一层可搜索文字，原件外观不变；扫描标书加文字层后就能全文检索。 | 说了输入输出、说了场景 |
| 差 | 一个强大的 PDF 处理库，功能丰富，性能优异，广受好评。 | 一句话能套在任何项目上 |
| 差 | PDF 解析库。 | 说了等于没说，读者不知道和自己有什么关系 |

另外：

- **不要写「免费」「开源」**——这本来就是开源列表。
- **不要写「最好用」「首选」「神器」**——收录不代表背书。
- 许可有坑（AGPL、附加条款、上游已归档）请写在 `notes` 里，这是本仓库最有价值的隐性信息。

---

## 提交前自检

```bash
npm run validate     # 必须全绿
npm run build        # 必须跑，且把产物一起提交
npm test             # 改了脚本才需要
```

`validate` 会拦这些：字段拼错、分类不存在、`repo` 与 `homepage` 都空、与已有条目重复（按仓库/主页/名称三重判重）、日期填成未来。

`build:check` 在 CI 里跑，会拦「改了数据忘了 build」。

---

## PR 约定

- 标题：`add: 项目名` / `fix: 项目名 链接失效` / `chore: 调整分类`，中英文都行，说清做了什么。
- 一个 PR 只做一件事。顺手改别人条目的格式，评审会很长。
- 被要求改的时候请直接改在原 PR 上，别关掉重开。

---

## 评审流程

- 一般 **7 天内**会有第一次回应。超过 14 天没动静，欢迎在 PR 里 `@` 维护者。
- 通过的标准只有一条：**符合 [收录标准](docs/criteria.md)，且描述准确**。
- 有争议（比如「这个算不算招投标相关」）会走 [GOVERNANCE.md](GOVERNANCE.md) 的裁决流程，不会因为「维护者不喜欢」就拒。

### 常见被拒原因

| 原因 | 怎么改 |
| --- | --- |
| 描述是营销话术 | 按上面「描述怎么写」重写 |
| 与已有条目重复 | 搜索后改成补充已有条目的 `notes`，或说明差异 |
| 链接是聚合站/网盘/转载页 | 换成项目自己的地址 |
| 记不清许可 | 写 `unknown` 也比写错好，CI 会对齐 GitHub |
| 是商业 SaaS，无免费层 | 不进列表，可在 Discussions 里推荐 |
| 是破解/绕过监管类工具 | 直接拒，见收录标准「明确不收」 |
| 一条 PR 塞了五个条目 | 拆开 |

---

## 想当维护者？

维护者做的事：定期跑 `npm run link-check` 处理死链、评审 PR、裁决分类争议。要求只有两条：**能用一句话判断条目合不合规**、**每周能抽半小时**。

在任意 PR 或 issue 里说一声就行。
