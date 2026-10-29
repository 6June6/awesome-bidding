# 招标公告与交易数据

> 公告抓取、结构化解析、开放数据接口、公共资源交易数据治理。

共 **3** 个条目。英文名：Bidding Announcements & Transaction Data。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [Scrapy](https://scrapy.org/) | 成熟的 Python 爬虫框架，靠 Spider 与 Item Pipeline 组织采集流程，适合批量抓取招标公告列表页与详情页。<br><sub>场景：定时抓取省市交易中心公告列表；把公告正文结构化后入库</sub> | 库 · Python · BSD-3-Clause · ★ 65.1k |
| [Playwright](https://playwright.dev/) | 跨浏览器自动化驱动，能等页面异步渲染完成再取内容；大量交易中心前端是 Vue/React 渲染，纯 HTTP 请求拿不到公告。<br><sub>场景：抓取前端异步渲染的公告详情；自动化走完查询表单再导出结果</sub> | 库 · TypeScript · Apache-2.0 · ★ 98.8k |
| [Crawlee](https://crawlee.dev/) | 自带请求队列、自动重试、会话与代理轮换的采集框架，适合要长期跑、规模上千个站点或页面的采集任务。<br><sub>场景：多站点公告持续采集并断点续跑；请求指纹与代理策略统一管理</sub> | 库 · TypeScript · Apache-2.0 · ★ 26.3k |

---

其它分类：[招标文件解析与文档理解](../list/doc-parse.md) · [标书制作与文档自动化](../list/bid-doc.md) · [造价算量与清单计价](../list/cost-quantity.md) · [BIM / CAD 与图纸](../list/bim-cad.md) · [合规审查与围串标识别](../list/compliance.md) · [电子签章与国密](../list/esign-crypto.md) · [项目管理与协同](../list/project-mgmt.md) · [数据、AI 与检索](../list/data-ai.md) · [GIS 与空间数据](../list/geo-space.md) · [通用办公与文档工具](../list/office-toolkit.md) · [标准、数据集与学习资源](../list/learning.md)

<sub><a href="../../README.md">返回首页</a></sub>

<sub>本页由 `npm run build` 生成，请勿手改。GitHub 元数据快照 2026-10-29。</sub>
