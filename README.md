# Awesome 招投标工程

**把散落在各处的开源工具，收进一张真正能用的地图。**

这个仓库只做一件事：为**招投标与工程建设**这条业务线，把好用的开源库、软件、AI 技能、数据集和标准收集到一起，并说清楚每个东西**在什么环节解决什么问题**——而不是又一份没人维护的「Awesome XXX」链接墙。

覆盖范围：招标公告采集与治理、招标文件解析、标书制作、造价算量、BIM/CAD、合规与围串标识别、电子签章与国密、项目管理、数据与 AI、GIS、办公工具、标准与学习资源。

**任何人都可以提交。** 你不需要是维护者，也不需要会写代码——填一张表单就够了，见 [怎么贡献](#怎么贡献)。

---

## 先看清三个事实

1. **这是目录，不是背书。** 收录只代表「它真实存在且相关」，不代表作者验证过安全性、合规性或商业适用性。上线前请自行评估，尤其是许可协议。
2. **条目由数据生成，不是手写表格。** 每一条是 `data/entries/` 下的一个 YAML 文件，README 与分类页由 `npm run build` 生成。所以 PR 永远不会互相冲突，你也不必编辑上千行的表格。
3. **拒绝一切绕过监管的东西。** 破解标书查重、伪造 CA 证书、绕过实名或围标工具，一律不收录。这不是洁癖，是底线，见 [收录标准](docs/criteria.md)。

---

## 按你的角色上手

| 你是谁 | 从这里开始 |
| --- | --- |
| **投标 / 造价从业者** | [招标文件解析](docs/list/doc-parse.md) · [标书制作](docs/list/bid-doc.md) · [办公工具](docs/list/office-toolkit.md) |
| **开发者** | [公告采集](docs/list/announce-data.md) · [电子签章与国密](docs/list/esign-crypto.md) · [数据格式](docs/data-format.md) |
| **做 AI 应用** | [数据、AI 与检索](docs/list/data-ai.md) · [合规审查](docs/list/compliance.md) |
| **想找替代方案** | [BIM / CAD](docs/list/bim-cad.md) · [项目管理](docs/list/project-mgmt.md) · [GIS](docs/list/geo-space.md) |

---

## 目录

<!-- BEGIN GENERATED: stats -->
**60** 个条目 · **12** 个分类 · **8** 种类型 · **12** 种语言

<sub>本页表格由 `npm run build` 从 `data/entries/` 生成，请勿手改。数据快照 2026-10-29。</sub>
<!-- END GENERATED: stats -->

<!-- BEGIN GENERATED: catalog -->
| 分类 | 条目 | 覆盖内容 |
| --- | --- | --- |
| [招标公告与交易数据](#招标公告与交易数据) | 3 | 公告抓取、结构化解析、开放数据接口、公共资源交易数据治理。 |
| [招标文件解析与文档理解](#招标文件解析与文档理解) | 11 | PDF / Word / OFD 抽取、扫描件 OCR、表格与条款结构化——让机器「读懂」招标文件的地基。 |
| [标书制作与文档自动化](#标书制作与文档自动化) | 5 | Word 模板批量生成、排版与目录页码、格式检查、导出 PDF。 |
| [造价算量与清单计价](#造价算量与清单计价) | 3 | 工程量计算、清单计价、钢筋翻样、BIM 算量。 |
| [BIM / CAD 与图纸](#bim--cad-与图纸) | 8 | IFC 解析与查看、DWG/DXF 处理、几何内核、图纸比对。 |
| [合规审查与围串标识别](#合规审查与围串标识别) | 5 | 投标文件雷同检测、资质核验、合同与条款审查、文本相似度。 |
| [电子签章与国密](#电子签章与国密) | 4 | CA 证书、SM2/SM3/SM4 国密算法、OFD 签章、投标文件加密解密。 |
| [项目管理与协同](#项目管理与协同) | 4 | 进度计划与甘特图、施工管理、任务协同、文档协作。 |
| [数据、AI 与检索](#数据ai-与检索) | 6 | LLM 应用框架、RAG、中文 NLP、向量检索、工程数据可视化。 |
| [GIS 与空间数据](#gis-与空间数据) | 3 | 地图引擎、坐标转换、工地选址、地形与遥感。 |
| [通用办公与文档工具](#通用办公与文档工具) | 5 | PDF 处理、OCR、Excel 表格、批量文件操作——投标日常的高频基建。 |
| [标准、数据集与学习资源](#标准数据集与学习资源) | 3 | IFC 等标准规范、公开数据集、教程与课程、行业白皮书。 |
<!-- END GENERATED: catalog -->

---

## 全部条目

> 每个分类在下面只展示前 12 条，完整清单点分类标题进详情页。排序规则：编辑精选优先，其次按维护者设定的权重。

<!-- BEGIN GENERATED: lists -->
### 招标公告与交易数据

> 公告抓取、结构化解析、开放数据接口、公共资源交易数据治理。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [Scrapy](https://scrapy.org/) | 成熟的 Python 爬虫框架，靠 Spider 与 Item Pipeline 组织采集流程，适合批量抓取招标公告列表页与详情页。 | 库 · Python · BSD-3-Clause · ★ 65.1k |
| [Playwright](https://playwright.dev/) | 跨浏览器自动化驱动，能等页面异步渲染完成再取内容；大量交易中心前端是 Vue/React 渲染，纯 HTTP 请求拿不到公告。 | 库 · TypeScript · Apache-2.0 · ★ 98.8k |
| [Crawlee](https://crawlee.dev/) | 自带请求队列、自动重试、会话与代理轮换的采集框架，适合要长期跑、规模上千个站点或页面的采集任务。 | 库 · TypeScript · Apache-2.0 · ★ 26.3k |

<sub>共 3 个 · [分类详情](docs/list/announce-data.md)</sub>

### 招标文件解析与文档理解

> PDF / Word / OFD 抽取、扫描件 OCR、表格与条款结构化——让机器「读懂」招标文件的地基。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [PDF.js](https://mozilla.github.io/pdf.js/) | 浏览器与 Node 端都能跑的 PDF 渲染与文本层抽取引擎，招标文件在线预览与文字检索的事实标准。 | 库 · JavaScript · Apache-2.0 · ★ 54.1k |
| [MinerU](https://opendatalab.com/OpenSourceTools/MinerU) | 把 PDF 转成保留公式、表格与阅读顺序的 Markdown/JSON，扫描件走 OCR 链路，适合喂给大模型做招标文件问答。 | 库 · Python · AGPL-3.0 · ★ 82.7k |
| [PaddleOCR](https://www.paddlepaddle.org.cn/paddle/paddleocr) | 中文场景最成熟的开源 OCR 之一，版面分析加快慢两档识别模型，能啃下扫描件、盖章页与拍照上传的资质证书。 | 库 · Python · Apache-2.0 · ★ 91.9k |
| [pdfplumber](https://github.com/jsvine/pdfplumber) | 能拿到每个字符的坐标、字号与表格线，按位置还原版面；评标办法、报价表这类靠排版传意的页面必须用它。 | 库 · Python · MIT · ★ 10.9k |
| [PyMuPDF](https://pymupdf.readthedocs.io/) | 速度极快的 PDF 解析与渲染库，一次遍历就能拿到文本块、图片、矢量图与页面像素，适合大批量招标文件预处理。 | 库 · Python · AGPL-3.0 · ★ 11.0k |
| [Docling](https://docling-project.github.io/docling/) | IBM 开源的多格式文档解析器，PDF/Word/PPT/图片统一转成结构化 JSON，输出带页码与元素坐标，便于回链原文。 | 库 · Python · MIT · ★ 69.8k |
| [Marker](https://github.com/VikParuchuri/marker) | 高精度的 PDF 转 Markdown 工具，表格与多栏版式还原效果好，适合把招标文件转成可检索、可喂模型的干净文本。 | 库 · Python · Apache-2.0 · ★ 40.7k |
| [Camelot](https://camelot-py.readthedocs.io/) | 专攻 PDF 表格抽取，提供线框表与无框表两套策略，输出直接是 DataFrame，工程量清单与报价表首选。 | 库 · Python · MIT · ★ 3.8k |
| [ofd.js](https://github.com/DLTech21/ofd.js) | 在浏览器里渲染 OFD 版式文件的 JS 组件，投标文件、电子发票的在线预览用得着。 | 库 · JavaScript · Apache-2.0 · ★ 344 |
| [EasyOFD](https://github.com/renoyuan/easyofd) | 纯 Python 解析 OFD：ofd 转图片或 PDF，也能把 PDF、图片转成 ofd，适合服务端批量处理。 | 库 · Python · Apache-2.0 · ★ 439 |
| [img2table](https://github.com/xavctn/img2table) | 走图像识别的表格抽取库，没有线框的扫描表格也能识别，正好补 Camelot 只吃有线框表的空白。 | 库 · Python · MIT · ★ 901 |

<sub>共 11 个 · [分类详情](docs/list/doc-parse.md)</sub>

### 标书制作与文档自动化

> Word 模板批量生成、排版与目录页码、格式检查、导出 PDF。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [OpenBidKit 易标](https://yibiao.pro) | 开箱即用的 AI 写标书工具：素材知识库、逐章生成、标书查重与废标项检查，桌面端和网页都能跑。 | 应用 · JavaScript · AGPL-3.0 · ★ 3.2k |
| [docxtemplater](https://docxtemplater.com/) | 用占位符把数据灌进 Word 模板，支持循环表格与条件段落，是批量生成投标函、承诺书、资格审查表的主力方案。 | 库 · JavaScript · MIT · ★ 3.6k |
| [python-docx](https://python-docx.readthedocs.io/) | 读写 .docx 的标准库，能改样式、页眉页脚、目录与表格，适合在生成标书后做格式规整与字段替换。 | 库 · Python · MIT · ★ 5.8k |
| [docx4j](https://www.docx4java.org/) | Java 生态里最完整的 Office Open XML 处理库，能直接 docx 转 PDF、做文档合并与域代码替换，适合已有 Java 后台的系统集成。 | 库 · Java · Apache-2.0 · ★ 2.4k |
| [Mammoth](https://github.com/mwilliamson/mammoth.js) | 把 .docx 转成语义干净的 HTML，丢掉 Word 那堆杂乱样式，适合做标书在线预览与结构化抽取的前置步骤。 | 库 · JavaScript · BSD-2-Clause · ★ 6.3k |

<sub>共 5 个 · [分类详情](docs/list/bid-doc.md)</sub>

### 造价算量与清单计价

> 工程量计算、清单计价、钢筋翻样、BIM 算量。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [IfcOpenShell](https://ifcopenshell.org/) | IFC 模型的解析与几何计算引擎，内置 ifc5d 算量与构件量提取，是开源 BIM 算量路线绕不开的底座。 | 库 · C++ / Python · LGPL-3.0 · ★ 2.9k |
| [OpenConstructionERP](https://openconstructionerp.com) | 开源施工 ERP：BOQ 清单、PDF/CAD/BIM 算量、成本数据匹配，自带 12 万条计价条目。 | 服务 · TypeScript · AGPL-3.0 · ★ 1.1k |
| [DDC 建筑 AI 技能包](https://datadrivenconstruction.io/) | 221 个建筑行业 AI 技能：BIM 分析、成本估算、进度排期、文档比对，Claude Code 之类可直接加载。 | 技能 · Python · MIT · ★ 375 |

<sub>共 3 个 · [分类详情](docs/list/cost-quantity.md)</sub>

### BIM / CAD 与图纸

> IFC 解析与查看、DWG/DXF 处理、几何内核、图纸比对。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [That Open Engine](https://thatopen.com/) | 在浏览器里直接加载、剖切与浏览 IFC 模型的前端组件库，不需要装任何桌面软件就能给业主看模型。 | 库 · TypeScript · MIT · ★ 721 |
| [FreeCAD](https://www.freecad.org/) | 参数化三维建模软件，BIM 工作台支持 IFC 导入导出，脚本接口完善，适合做施工方案与临时结构建模。 | 应用 · C++ / Python · LGPL-2.1 · ★ 34.9k |
| [LibreCAD](https://librecad.org/) | 专注二维的开源 CAD，能读写 DXF，界面接近传统 CAD，用来量图、改图与出平面大样足够。 | 应用 · C++ · GPL-2.0 · ★ 6.5k |
| [ezdxf](https://ezdxf.mozman.at/) | 纯 Python 的 DXF 读写库，可以批量改图层、统计图块与实体数量，也能在图纸上自动标注。 | 库 · Python · MIT · ★ 1.5k |
| [Open CASCADE (OCCT)](https://dev.opencascade.org/) | 工业级三维几何内核，布尔运算、曲面与网格都成熟，多数开源 CAD/BIM 软件的底层都建在它上面。 | 库 · C++ · LGPL-2.1 · ★ 3.1k |
| [web-ifc](https://thatopen.github.io/engine_web-ifc/demo) | 用 JavaScript 读写 IFC 的底层内核，速度接近原生；已收录的 That Open Engine 加载 IFC 就靠它。 | 库 · TypeScript · MPL-2.0 · ★ 1.1k |
| [mlightcad CAD Viewer](https://mlightcad.com/cad-viewer/) | 纯浏览器的 DWG/DXF 查看与编辑器，不用后端转换、不用装 AutoCAD 就能打开图纸。 | 库 · TypeScript · MIT · ★ 1.2k |
| [Astral3D](https://3d.astraljs.com) | 基于 Vue3 + Three.js 的国产三维引擎与编辑器，自带 BIM 轻量化、CAD 解析预览，中文文档齐全。 | 库 · JavaScript · Apache-2.0 · ★ 2.5k |

<sub>共 8 个 · [分类详情](docs/list/bim-cad.md)</sub>

### 合规审查与围串标识别

> 投标文件雷同检测、资质核验、合同与条款审查、文本相似度。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [datasketch](https://github.com/ekzhu/datasketch) | MinHash + LSH 的近似去重库，能把投标文件两两比对从 O(n²) 降到可接受规模，是做雷同检测的基础件。 | 库 · Python · MIT · ★ 3.0k |
| [HanLP](https://hanlp.hankcs.com/) | 中文分词、词性与依存句法分析工具包，用来从招标文件里抽资格条件、评分项与实质性条款。 | 库 · Java / Python · Apache-2.0 · ★ 36.5k |
| [jieba](https://github.com/fxsjy/jieba) | 轻量中文分词，装好即用、支持自定义词典，把「公开招标」「资格预审」这类行业词加进去就够日常文本分析。 | 库 · Python · MIT · ★ 35.2k |
| [text2vec](https://github.com/shibing624/text2vec) | 中文文本向量与语义相似度工具箱，把句子编码成向量后算余弦距离，比字面比对更能抓住改写过措辞的雷同段落。 | 库 · Python · Apache-2.0 · ★ 5.0k |
| [Claude Legal Skill](https://github.com/evolsb/claude-legal-skill) | 合同审查 AI 技能：按 CUAD 风险点清单逐条比对，产出带批注的修改稿，可接 Claude Code 等工具。 | 技能 · MIT · ★ 487 |

<sub>共 5 个 · [分类详情](docs/list/compliance.md)</sub>

### 电子签章与国密

> CA 证书、SM2/SM3/SM4 国密算法、OFD 签章、投标文件加密解密。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [GmSSL](https://github.com/guanzhi/GmSSL) | 支持 SM2/SM3/SM4/SM9 的国密算法库，命令行与开发接口齐全，做投标文件加解密与签名验签绕不开。 | 库 · C · Apache-2.0 · ★ 6.2k |
| [开放签](https://github.com/kaifangqian/kaifangqian-base) | 开源电子签章前端：手写签名面板、印章生成、按关键字定位签署位置，能直接搭自己的签章系统。 | 应用 · Vue · AGPL-3.0 · ★ 523 |
| [OFD Reader & Writer](https://github.com/Trisia/ofdrw) | 国产版式文档 OFD 的读写与签章库，政府采购与交易平台大量用 OFD 出中标通知书，PDF 库替代不了。 | 库 · Java · MIT · ★ 1.9k |
| [Mini Contract](https://s.leepm.com) | 可私有化部署的电子合同平台，一套代码同时对接腾讯电子签、法大大、君子签等多家签章服务。 | 服务 · JavaScript · unknown · ★ 325 |

<sub>共 4 个 · [分类详情](docs/list/esign-crypto.md)</sub>

### 项目管理与协同

> 进度计划与甘特图、施工管理、任务协同、文档协作。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [OpenProject](https://www.openproject.org/) | 功能最接近商业项目管理套件的开源方案，甘特图、里程碑、预算与工时都在，可自部署在自有服务器上。 | 服务 · Ruby · GPL-3.0 · ★ 16.8k |
| [GanttProject](https://www.ganttproject.biz/) | 桌面端甘特图工具，能导出 PDF 与 MS Project 格式，轻量、离线可用，做投标文件的进度计划附图表很顺手。 | 应用 · Java · GPL-3.0 · ★ 1.1k |
| [Redmine](https://www.redmine.org/) | 老牌开源项目跟踪系统，问题单、工时、文档与 Wiki 齐全，插件生态大，适合做投标项目的协同台账。 | 服务 · Ruby · GPL-2.0 · ★ 6.1k |
| [ONLYOFFICE DocumentServer](https://www.onlyoffice.com/) | 可自部署的在线 Office 套件，文档/表格/演示多人协同编辑且与 docx/xlsx 高度兼容，适合内网做标书协同。 | 服务 · C++ / JavaScript · AGPL-3.0 · ★ 7.1k |

<sub>共 4 个 · [分类详情](docs/list/project-mgmt.md)</sub>

### 数据、AI 与检索

> LLM 应用框架、RAG、中文 NLP、向量检索、工程数据可视化。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [RAGFlow](https://ragflow.io/) | 带深度文档解析的 RAG 引擎，能直接吃 PDF/Word 做切片与检索，适合搭招标文件与法规库的问答系统。 | 服务 · Python · Apache-2.0 · ★ 93.0k |
| [Dify](https://dify.ai/) | 可视化的大模型应用编排平台，拖拽就能搭出「读招标文件 → 抽资格条件 → 生成响应清单」的工作流。 | 服务 · TypeScript / Python · Apache-2.0（附加条款） · ★ 159.9k |
| [LlamaIndex](https://docs.llamaindex.ai/) | 面向私有数据的检索增强框架，把招标文件、法规、历史标书建成可查询索引，是自建问答系统的常用起点。 | 库 · Python · MIT · ★ 52.7k |
| [Apache ECharts](https://echarts.apache.org/) | 成熟的中文友好图表库，把中标金额、区域分布、竞争对手胜率做成看板，一小时能出可用原型。 | 库 · TypeScript · Apache-2.0 · ★ 67.6k |
| [AntV G6](https://g6.antv.antgroup.com/) | 图可视化引擎，适合把「投标人—联系人—地址—中标项目」画成关系网络，围串标线索一眼看得出来。 | 库 · TypeScript · MIT · ★ 12.4k |
| [funNLP](https://zhuanlan.zhihu.com/yangyangfuture) | 中文 NLP 资源总索引：词表、敏感词库、实体抽取工具、相似度算法与语料，做中文文本处理先翻这里。 | 资源 · Python · unknown · ★ 84.2k |

<sub>共 6 个 · [分类详情](docs/list/data-ai.md)</sub>

### GIS 与空间数据

> 地图引擎、坐标转换、工地选址、地形与遥感。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [QGIS](https://qgis.org/) | 桌面 GIS 的事实标准，看地形、算运距、画工地范围、做场平分析都在里面完成，插件可脚本化。 | 应用 · C++ / Python · GPL-2.0 · ★ 14.7k |
| [Cesium](https://cesium.com/platform/cesiumjs/) | 浏览器里的三维地球引擎，能把 BIM 模型叠到真实地形上，适合做方案汇报与场地三维展示。 | 库 · JavaScript · Apache-2.0 · ★ 15.9k |
| [OpenLayers](https://openlayers.org/) | 二维地图前端库，能对接各种瓦片与 WMS 服务，做项目分布地图与行政区划钻取足够稳。 | 库 · JavaScript · BSD-2-Clause · ★ 12.6k |

<sub>共 3 个 · [分类详情](docs/list/geo-space.md)</sub>

### 通用办公与文档工具

> PDF 处理、OCR、Excel 表格、批量文件操作——投标日常的高频基建。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [OCRmyPDF](https://ocrmypdf.readthedocs.io/) | 给扫描版 PDF 补一层可搜索的文字，原件外观不变；扫描标书加文字层后就能全文检索与复制。 | 命令行 · Python · MPL-2.0 · ★ 35.2k |
| [SheetJS](https://sheetjs.com/) | 跨端电子表格读写库，能把 xlsx 当数据库一样解析和生成，用来对接清单报价表、投标报价汇总表特别省事。 | 库 · JavaScript · Apache-2.0 · ★ 36.3k |
| [Univer](https://univer.ai/) | 可嵌入的在线表格与文档引擎，支持公式、协同与导入导出，适合在系统里直接打开并编辑报价表。 | 库 · TypeScript · Apache-2.0 · ★ 22.8k |
| [qpdf](https://qpdf.readthedocs.io/) | PDF 结构级处理工具，无损合并拆分、旋转页面、加密解密、修复损坏文件，批量整理标书附件很可靠。 | 命令行 · C++ · Apache-2.0 · ★ 5.5k |
| [flyfish file-viewer](https://file-viewer.app) | 纯前端预览 275+ 种文件：Office、PDF、OFD、CAD、3D、压缩包，不需要服务端转换。 | 库 · TypeScript · Apache-2.0 · ★ 2.7k |

<sub>共 5 个 · [分类详情](docs/list/office-toolkit.md)</sub>

### 标准、数据集与学习资源

> IFC 等标准规范、公开数据集、教程与课程、行业白皮书。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [IFC 标准（ISO 16739）](https://standards.buildingsmart.org/IFC/) | BIM 数据交换的国际标准，也是算量、模型审查、构件编码所有工作的共同语言；做 BIM 相关开发必须读一遍。 | 规范 · buildingSMART 许可 |
| [OSArch 社区](https://osarch.org/) | 开源建筑与工程（AEC）领域的中立社区，汇集开源工具评测、项目索引与从业者讨论，找「有没有开源替代」先来这里。 | 资源 · unknown |
| [buildingSMART 认证样例数据](https://github.com/buildingSMART/Certification-datasets) | buildingSMART 官方 IFC 认证样例：各版本 schema、各格式的真实模型，测解析器就拿它当基准。 | 数据集 · NOASSERTION · ★ 363 |

<sub>共 3 个 · [分类详情](docs/list/learning.md)</sub>
<!-- END GENERATED: lists -->

---

## 怎么贡献

三条路径，按省事程度排：

### 1. 填表单（不用会 Git，2 分钟）

打开 [新增条目表单](https://github.com/6June6/awesome-bidding/issues/new?template=add-entry.yml)，填项目名、链接、用一句话说清它解决什么问题。维护者会替你转成数据文件。

### 2. 提 PR（推荐，自己动手最快合）

只加一个文件，别改别的：

```bash
# 1. 复制模板
cp data/entries/_template.yml data/entries/<owner>--<repo>.yml

# 2. 填内容（字段说明见 docs/data-format.md）
# 3. 本地自检 + 生成产物
npm install
npm run validate && npm run build

# 4. 提交（数据文件 + README + docs/list 一起提交）
```

也可以直接 `npm run new`，交互式问答帮你生成文件。

### 3. 发现问题

- [报失效链接](https://github.com/6June6/awesome-bidding/issues/new?template=broken-link.yml)
- [提议新分类](https://github.com/6June6/awesome-bidding/issues/new?template=suggest-category.yml)
- 想长期参与维护？在 [维护者招募 issue](https://github.com/6June6/awesome-bidding/issues) 里留言，或在任意 PR 里说一声。

**PR 通过的最低门槛**（CI 会逐条检查，本地 `npm run validate` 结果一致）：

- 结构符合 [`schema/entry.schema.json`](schema/entry.schema.json)
- 分类必须是 [已有分类](data/categories.yml) 之一
- `repo` 与 `homepage` 至少填一个，且是项目自己的地址（不能是转载页、聚合站、网盘）
- 不与已有条目重复（按仓库、主页、名称三重判重）
- 描述必须写清**在招投标/工程场景里解决什么问题**，不要抄项目简介的营销词

细则都在 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 收录标准（摘要）

**收**：真实可获取的开源项目或免费可用的软件；与招投标、工程建设有明确业务关联；有文档或至少能跑起来；近两年有维护（老而不死、仍有参考价值的可标 `archived`）。

**不收**：纯营销落地页；无免费层的商业 SaaS；破解版、绕过实名/CA/查重的工具；与行业无关的通用项目（除非在业务里被高频使用，如 PDF、OCR、Excel 库）；已彻底停止维护且无替代价值的。

完整版：[docs/criteria.md](docs/criteria.md)。有争议的条目按 [GOVERNANCE.md](GOVERNANCE.md) 处理。

---

## 数据怎么用

`dist/index.json` 是给机器读的全量数据，字段与 YAML 一一对应：

```jsonc
{
  "total": 45,
  "categories": [{ "slug": "doc-parse", "name": "招标文件解析与文档理解", "count": 8 }],
  "entries": [
    {
      "id": "mozilla--pdf-js",
      "name": "PDF.js",
      "category": "doc-parse",
      "kind": "library",
      "url": "https://mozilla.github.io/pdf.js/",
      "license": "Apache-2.0",
      "language": "JavaScript",
      "tags": ["PDF", "文本抽取"],
      "stars": 48000
    }
  ]
}
```

- 想做自己的导航页、小程序、扩展？直接取这个 JSON。
- 想要现成的「站点条目」结构？`npm run export:webapps` 会把软件类条目转成通用站点格式。

### 导出成站点数据

如果你的场景是导航页、小程序或浏览器扩展，需要的是「一条一条可以点开的站点」，那么：

```bash
npm run export:webapps   # 产出 dist/webapps.json
```

只导出 `kind: app / service / cli` 这类有可直接访问地址的条目，每条含 `name / url / desc / alias`，不属于任何产品的私有格式。

导出结果需要人工过一遍——开源软件和「能在浏览器里直接打开的站点」不是一回事，脚本不做主观判断。这个仓库不绑定、也不承诺适配任何特定产品。

---

## 仓库结构

```
data/categories.yml     分类定义（唯一真值源）
data/entries/*.yml      条目，一条一个文件，文件名即 id
data/metrics.json       GitHub 元数据缓存（star / 许可 / 最后推送），由 npm run enrich 更新
data/link-status.json   链接巡检结果，由 npm run link-check 更新
schema/entry.schema.json  条目结构定义
scripts/                校验、构建、巡检、导出
docs/criteria.md        收录标准（有争议先看这里）
docs/taxonomy.md        分类体系与新增分类流程
docs/data-format.md     字段逐项说明
docs/list/*.md          分类详情页（自动生成）
dist/index.json         机读全量数据（自动生成）
```

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run validate` | 结构与业务规则校验，PR 必过 |
| `npm run build` | 重新生成 README、分类页、`dist/index.json` |
| `npm run build:check` | 只比对不写入，CI 用来拦「忘了 build」 |
| `npm run new` | 交互式新建条目 |
| `npm run enrich` | 拉 GitHub 元数据（star / 许可 / 归档状态） |
| `npm run link-check` | 链接巡检，区分「真死链」与「被 WAF 拦」 |
| `npm run export:webapps` | 导出成通用站点条目数据（导航页 / 小程序 / 扩展可用） |
| `npm test` | 脚本自身的单元测试 |

---

## 许可

- **内容**（`data/`、`docs/`、`README.md`）：[CC0-1.0](LICENSE) —— 公共领域，随便用。
- **脚本**（`scripts/`、`tests/`）：[MIT](LICENSE-CODE)。

收录的第三方项目各自遵循其原许可，本仓库不改变、也不代表其许可状态。**商用前请自行核对许可**，特别是 AGPL 与「Apache-2.0 + 附加条款」类项目（列表里已标注）。

## 免责

本项目是社区目录，与所列项目无隶属关系，不对其功能、安全性、合规性作任何担保。用于招投标业务时，请遵守《招标投标法》《政府采购法》及平台规则；任何自动化采集与数据处理行为，责任由使用者自负。
