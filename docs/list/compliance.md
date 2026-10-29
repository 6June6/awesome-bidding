# 合规审查与围串标识别

> 投标文件雷同检测、资质核验、合同与条款审查、文本相似度。

共 **5** 个条目。英文名：Compliance & Bid-Rigging Detection。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [datasketch](https://github.com/ekzhu/datasketch) | MinHash + LSH 的近似去重库，能把投标文件两两比对从 O(n²) 降到可接受规模，是做雷同检测的基础件。<br><sub>场景：上百家投标文件的交叉雷同筛查；历史标书库查重</sub> | 库 · Python · MIT · ★ 3.0k |
| [HanLP](https://hanlp.hankcs.com/) | 中文分词、词性与依存句法分析工具包，用来从招标文件里抽资格条件、评分项与实质性条款。<br><sub>场景：从句子里抽「投标人须具备」类资格条件；识别评分办法中的分值结构</sub> | 库 · Java / Python · Apache-2.0 · ★ 36.5k |
| [jieba](https://github.com/fxsjy/jieba) | 轻量中文分词，装好即用、支持自定义词典，把「公开招标」「资格预审」这类行业词加进去就够日常文本分析。<br><sub>场景：招标公告关键词统计；术语命中与规则匹配前的切词</sub> | 库 · Python · MIT · ★ 35.2k |
| [text2vec](https://github.com/shibing624/text2vec) | 中文文本向量与语义相似度工具箱，把句子编码成向量后算余弦距离，比字面比对更能抓住改写过措辞的雷同段落。<br><sub>场景：语义级投标文件段落比对；招标文件与法规条款的相似匹配</sub> | 库 · Python · Apache-2.0 · ★ 5.0k |
| [Claude Legal Skill](https://github.com/evolsb/claude-legal-skill) | 合同审查 AI 技能：按 CUAD 风险点清单逐条比对，产出带批注的修改稿，可接 Claude Code 等工具。<br><sub>场景：快速出一版合同风险点清单与修改建议；把招标文件里的合同条款对照市场基准</sub> | 技能 · MIT · ★ 487 |

---

其它分类：[招标公告与交易数据](../list/announce-data.md) · [招标文件解析与文档理解](../list/doc-parse.md) · [标书制作与文档自动化](../list/bid-doc.md) · [造价算量与清单计价](../list/cost-quantity.md) · [BIM / CAD 与图纸](../list/bim-cad.md) · [电子签章与国密](../list/esign-crypto.md) · [项目管理与协同](../list/project-mgmt.md) · [数据、AI 与检索](../list/data-ai.md) · [GIS 与空间数据](../list/geo-space.md) · [通用办公与文档工具](../list/office-toolkit.md) · [标准、数据集与学习资源](../list/learning.md)

<sub><a href="../../README.md">返回首页</a></sub>

<sub>本页由 `npm run build` 生成，请勿手改。GitHub 元数据快照 2026-10-29。</sub>
