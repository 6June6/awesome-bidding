# 招标文件解析与文档理解

> PDF / Word / OFD 抽取、扫描件 OCR、表格与条款结构化——让机器「读懂」招标文件的地基。

共 **8** 个条目。英文名：Document Parsing。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [PDF.js](https://mozilla.github.io/pdf.js/) | 浏览器与 Node 端都能跑的 PDF 渲染与文本层抽取引擎，招标文件在线预览与文字检索的事实标准。<br><sub>场景：招标文件在浏览器里翻页预览；取文字层做全文检索与条款定位</sub> | 库 · JavaScript · Apache-2.0 · ★ 54.1k |
| [MinerU](https://opendatalab.com/OpenSourceTools/MinerU) | 把 PDF 转成保留公式、表格与阅读顺序的 Markdown/JSON，扫描件走 OCR 链路，适合喂给大模型做招标文件问答。<br><sub>场景：招标文件转 Markdown 后建知识库；扫描版图纸说明与规范批量结构化</sub> | 库 · Python · AGPL-3.0 · ★ 82.7k |
| [PaddleOCR](https://www.paddlepaddle.org.cn/paddle/paddleocr) | 中文场景最成熟的开源 OCR 之一，版面分析加快慢两档识别模型，能啃下扫描件、盖章页与拍照上传的资质证书。<br><sub>场景：识别扫描版招标文件与图纸说明；提取营业执照、资质证书字段</sub> | 库 · Python · Apache-2.0 · ★ 91.9k |
| [pdfplumber](https://github.com/jsvine/pdfplumber) | 能拿到每个字符的坐标、字号与表格线，按位置还原版面；评标办法、报价表这类靠排版传意的页面必须用它。<br><sub>场景：按坐标定位并抽取评分表；还原多栏排版的招标文件段落顺序</sub> | 库 · Python · MIT · ★ 10.9k |
| [PyMuPDF](https://pymupdf.readthedocs.io/) | 速度极快的 PDF 解析与渲染库，一次遍历就能拿到文本块、图片、矢量图与页面像素，适合大批量招标文件预处理。<br><sub>场景：上千份招标文件批量抽文本与首页截图；把 PDF 页转图片交给 OCR 或视觉模型</sub> | 库 · Python · AGPL-3.0 · ★ 11.0k |
| [Docling](https://docling-project.github.io/docling/) | IBM 开源的多格式文档解析器，PDF/Word/PPT/图片统一转成结构化 JSON，输出带页码与元素坐标，便于回链原文。<br><sub>场景：招标文件与投标文件统一解析成同一套结构；解析结果带页码坐标，做原文溯源引用</sub> | 库 · Python · MIT · ★ 69.8k |
| [Marker](https://github.com/VikParuchuri/marker) | 高精度的 PDF 转 Markdown 工具，表格与多栏版式还原效果好，适合把招标文件转成可检索、可喂模型的干净文本。<br><sub>场景：招标文件高质量转 Markdown；批量处理含大量表格的报价文件</sub> | 库 · Python · Apache-2.0 · ★ 40.7k |
| [Camelot](https://camelot-py.readthedocs.io/) | 专攻 PDF 表格抽取，提供线框表与无框表两套策略，输出直接是 DataFrame，工程量清单与报价表首选。<br><sub>场景：抽取招标文件里的工程量清单表；把投标报价表批量转成 Excel</sub> | 库 · Python · MIT · ★ 3.8k |

---

其它分类：[招标公告与交易数据](../list/announce-data.md) · [标书制作与文档自动化](../list/bid-doc.md) · [造价算量与清单计价](../list/cost-quantity.md) · [BIM / CAD 与图纸](../list/bim-cad.md) · [合规审查与围串标识别](../list/compliance.md) · [电子签章与国密](../list/esign-crypto.md) · [项目管理与协同](../list/project-mgmt.md) · [数据、AI 与检索](../list/data-ai.md) · [GIS 与空间数据](../list/geo-space.md) · [通用办公与文档工具](../list/office-toolkit.md) · [标准、数据集与学习资源](../list/learning.md)

<sub><a href="../../README.md">返回首页</a></sub>

<sub>本页由 `npm run build` 生成，请勿手改。GitHub 元数据快照 2026-10-29。</sub>
