# 电子签章与国密

> CA 证书、SM2/SM3/SM4 国密算法、OFD 签章、投标文件加密解密。

共 **4** 个条目。英文名：E-Signature & Cryptography。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [GmSSL](https://github.com/guanzhi/GmSSL) | 支持 SM2/SM3/SM4/SM9 的国密算法库，命令行与开发接口齐全，做投标文件加解密与签名验签绕不开。<br><sub>场景：生成符合国密要求的密钥对与证书请求；校验招投标平台返回的签名</sub> | 库 · C · Apache-2.0 · ★ 6.2k |
| [开放签](https://github.com/kaifangqian/kaifangqian-base) | 开源电子签章前端：手写签名面板、印章生成、按关键字定位签署位置，能直接搭自己的签章系统。<br><sub>场景：给投标文件加骑缝章与签署位；自建电子合同签署页，替代第三方 SaaS</sub> | 应用 · Vue · AGPL-3.0 · ★ 523 |
| [OFD Reader & Writer](https://github.com/Trisia/ofdrw) | 国产版式文档 OFD 的读写与签章库，政府采购与交易平台大量用 OFD 出中标通知书，PDF 库替代不了。<br><sub>场景：解析交易平台下发的 OFD 中标通知书；在 OFD 上加盖电子印章</sub> | 库 · Java · MIT · ★ 1.9k |
| [Mini Contract](https://s.leepm.com) | 可私有化部署的电子合同平台，一套代码同时对接腾讯电子签、法大大、君子签等多家签章服务。<br><sub>场景：一套接口兼容多家 CA 与签章服务；合同签署流程私有化部署，数据不出内网</sub> | 服务 · JavaScript · unknown · ★ 325 |

---

其它分类：[招标公告与交易数据](../list/announce-data.md) · [招标文件解析与文档理解](../list/doc-parse.md) · [标书制作与文档自动化](../list/bid-doc.md) · [造价算量与清单计价](../list/cost-quantity.md) · [BIM / CAD 与图纸](../list/bim-cad.md) · [合规审查与围串标识别](../list/compliance.md) · [项目管理与协同](../list/project-mgmt.md) · [数据、AI 与检索](../list/data-ai.md) · [GIS 与空间数据](../list/geo-space.md) · [通用办公与文档工具](../list/office-toolkit.md) · [标准、数据集与学习资源](../list/learning.md)

<sub><a href="../../README.md">返回首页</a></sub>

<sub>本页由 `npm run build` 生成，请勿手改。GitHub 元数据快照 2026-10-29。</sub>
