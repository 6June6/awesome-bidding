# 数据格式

每条记录是 `data/entries/` 下的一个 YAML 文件。**文件名（去掉 `.yml`）就是条目 id**，全站唯一。

结构由 [`schema/entry.schema.json`](../schema/entry.schema.json) 定义（JSON Schema 2020-12）。VS Code 装了 YAML 插件会自动补全与校验——仓库里的 `.vscode/settings.json` 已经配好映射。

真实的字段约束以 schema 为准，本文解释**为什么这么设计**。

---

## 一个完整例子

```yaml
name: pdfplumber
category: doc-parse
kind: library
repo: jsvine/pdfplumber
homepage: null
license: MIT
language: Python
platform: [linux, macos, windows]
description: 能拿到每个字符的坐标、字号与表格线，按位置还原版面；评标办法、报价表这类靠排版传意的页面必须用它。
tags: [PDF, 表格抽取, 版面分析]
use_cases:
  - 按坐标定位并抽取评分表
  - 还原多栏排版的招标文件段落顺序
featured: false
order: 20
added: 2026-10-29
added_by: seed
notes: |
  纯 Python 实现，速度比 PyMuPDF 慢一个量级，适合精抽而非全量批处理。
```

---

## 字段逐个说

### `name` 必填
展示名。有中文名就用中文名（「招标文件解析」优于「Bid Document Parser」）。会出现在表格和搜索结果里。

不要加「官方」「最强」「首选」这类修饰——列表本身不背书。

### `category` 必填
必须是 [`data/categories.yml`](../data/categories.yml) 里存在的 slug。**一条只归一个分类**，不允许多分类，否则统计和导航都会乱。

拿不准归哪类？挑「读者会在哪个环节找它」的那个，而不是「它在技术上属于什么」。PDF 解析库归 `doc-parse` 而不是 `office-toolkit`，因为读者是在处理招标文件时找它。

### `kind` 必填

| 值 | 含义 | 例子 |
| --- | --- | --- |
| `library` | 库 / SDK，要被别的代码调用 | pdfplumber、ezdxf |
| `app` | 装在自己电脑上用的软件 | FreeCAD、QGIS |
| `cli` | 命令行工具 | qpdf、OCRmyPDF |
| `service` | 可自部署的服务端系统 | OpenProject、RAGFlow |
| `plugin` | 插件 / 浏览器扩展 | — |
| `skill` | AI Agent 技能（Claude/WorkBuddy 等平台的 skill） | — |
| `dataset` | 数据集、模板库、语料 | 标书模板库 |
| `spec` | 标准、规范、协议 | IFC 标准 |
| `resource` | 资源站、教程、社区、索引 | OSArch 社区 |

`library` 和 `app` 的区别是**要不要写代码才能用**。不确定就问：非程序员能不能直接打开用？能→`app`。

### `repo` / `homepage` 至少一个
- `repo` 只填 GitHub 的 `owner/repo`。GitLab、Gitee、自建 Git 一律写 `null`，把地址放 `homepage`。
- `homepage` 必须是**项目自己的**地址（官网、文档站、下载页）。不能是聚合站、网盘、转载页、CSDN 文章。
- 两个都填时，列表里优先链 `homepage`；`homepage` 与 `repo` 是同一地址的话留空即可。

为什么要分开：`npm run enrich` 靠 `repo` 拉 star / 许可 / 维护状态，`npm run link-check` 靠 `homepage` 巡检。混在一起会让这两个脚本都变笨。

### `license` 必填
SPDX 标识（`MIT`、`Apache-2.0`、`AGPL-3.0`、`GPL-2.0`、`BSD-3-Clause`、`MPL-2.0`…）。

- 许可带附加条件时照实写，如 `Apache-2.0（附加条款）`——这比写 `Apache-2.0` 有用得多。
- 闭源但免费可用 → `proprietary`。
- 拿不准 → `unknown`。**写 unknown 不会被打回，写错会。**
- `npm run enrich` 会拿 GitHub API 的结论做比对，不一致时只提示、不自动改（人工判断更准）。

### `language` 可选
主要实现语言：`Python`、`TypeScript`、`Java`、`C++`、`Rust`……多种语言用 ` / ` 分隔（`C++ / Python`）。纯规范/数据集留 `null`。

### `platform` 可选
数组，可选值：`windows` `macos` `linux` `web` `android` `ios` `server` `cli`。

- 库一般别写 `server`，除非它只在服务端有意义
- 能跑在浏览器里就加 `web`（这是读者最关心的信息之一）
- 纯命令行工具写 `cli`，跨平台再补具体的

### `description` 必填（12~120 字）
全仓库最值钱的字段。写法见 [CONTRIBUTING.md 的「描述怎么写」](../CONTRIBUTING.md#描述怎么写)。

硬约束只有长度，但内容上请守住：**说能力和场景，不说形容词。**

### `tags` 可选
2~6 个读者真会拿去搜的词，中英文混排都行（`[PDF, 表格抽取, 版面分析]`）。

别把分类名再抄一遍，也别堆十几个——标签只在全站搜索里用，堆多了只是噪音。

### `use_cases` 可选（强烈建议）
2~5 条具体场景，每条 ≤40 字。这是把「通用工具」翻译成「这个行业能用」的地方。

好：`抽取招标文件里的工程量清单表`
差：`用于数据处理`

### `featured` 只由维护者设置
进入 README 顶部排序优先位。PR 里请留 `false`——自己标精选会被改回去，还容易让评审跑题。

标准：**这个分类里如果只能留三个，它值不值得占一个。**

### `order` 可选
同分类排序权重，默认 `100`，小的靠前。`featured` 优先级高于 `order`。

只在有明显「该排前面」的理由时才动（比如某个工具是这个环节的事实标准）。

### `added` / `added_by` 可选
收录日期与推荐人 handle。`added` 填当天，填未来日期会被 validate 拦。

### `archived` 可选
上游已归档或长期停更，但仍有参考价值。列表里会显示「（已归档）」。见 [收录标准的下架规则](criteria.md#下架规则)。

### `notes` 可选（≤800 字）
**本仓库区别于普通 Awesome 列表的地方。** 写别人踩过的坑：

- 许可陷阱（AGPL 对外提供服务要开源；某模块要商业授权）
- 能力边界（不解析扫描件、不支持 DWG、只支持 Windows）
- 替代关系（「A 的轻量替代，但少了 B 功能」）
- 实测结论（「1000 页 PDF 处理约 40 秒，内存峰值 2GB」）

多行用 YAML 的 `|` 块：

```yaml
notes: |
  第一行。
  第二行。
```

---

## 条目的 id 从哪来

文件名决定 id：

- GitHub 项目 → `owner--repo.yml`，全小写，`.` 换成 `-`
  `mozilla/pdf.js` → `mozilla--pdf-js.yml`
- 其它 → 项目 slug：`ifc-standard.yml`

**改名会破坏外部引用**（`dist/index.json` 里的 id、别人项目里的链接）。除非条目本身错了，否则不要改文件名。

---

## 这些情况 validate 会报错

| 报错 | 原因 |
| --- | --- |
| 字段 xxx 不在 schema 里 | 拼写错误，或用了未定义的字段 |
| 分类「xxx」不存在 | slug 写错，或该分类还没建（先按 [taxonomy](taxonomy.md) 提 issue） |
| repo 和 homepage 至少要填一个 | 读者找不到项目 |
| 仓库 xxx 已被 yyy 收录 | 重复条目，改成补充已有条目的 notes |
| 名称「xxx」与 yyy 重复 | 同名不同项目，加限定词区分 |
| added 是未来日期 | 填当天 |
| 文件名「xxx.yml」不合规 | id 只能小写字母、数字、连字符 |

跑 `npm run validate` 看全部问题，报错都带文件路径。
