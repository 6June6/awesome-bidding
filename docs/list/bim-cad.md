# BIM / CAD 与图纸

> IFC 解析与查看、DWG/DXF 处理、几何内核、图纸比对。

共 **8** 个条目。英文名：BIM, CAD & Drawings。

| 项目 | 说明 | 信息 |
| --- | --- | --- |
| [That Open Engine](https://thatopen.com/) | 在浏览器里直接加载、剖切与浏览 IFC 模型的前端组件库，不需要装任何桌面软件就能给业主看模型。<br><sub>场景：网页端三维查看投标方案模型；模型构件与清单条目联动高亮</sub> | 库 · TypeScript · MIT · ★ 721 |
| [FreeCAD](https://www.freecad.org/) | 参数化三维建模软件，BIM 工作台支持 IFC 导入导出，脚本接口完善，适合做施工方案与临时结构建模。<br><sub>场景：施工方案临时结构建模；用 Python 脚本批量生成构件</sub> | 应用 · C++ / Python · LGPL-2.1 · ★ 34.9k |
| [LibreCAD](https://librecad.org/) | 专注二维的开源 CAD，能读写 DXF，界面接近传统 CAD，用来量图、改图与出平面大样足够。<br><sub>场景：打开招标图纸量尺寸；补画平面布置与大样图</sub> | 应用 · C++ · GPL-2.0 · ★ 6.5k |
| [ezdxf](https://ezdxf.mozman.at/) | 纯 Python 的 DXF 读写库，可以批量改图层、统计图块与实体数量，也能在图纸上自动标注。<br><sub>场景：统计图纸里各类构件的数量；批量替换图框与图层规范</sub> | 库 · Python · MIT · ★ 1.5k |
| [Open CASCADE (OCCT)](https://dev.opencascade.org/) | 工业级三维几何内核，布尔运算、曲面与网格都成熟，多数开源 CAD/BIM 软件的底层都建在它上面。<br><sub>场景：自研算量或构件识别工具；图纸几何校验与干涉检查</sub> | 库 · C++ · LGPL-2.1 · ★ 3.1k |
| [web-ifc](https://thatopen.github.io/engine_web-ifc/demo) | 用 JavaScript 读写 IFC 的底层内核，速度接近原生；已收录的 That Open Engine 加载 IFC 就靠它。<br><sub>场景：网页里加载 IFC 模型并读取构件属性；服务端批量解析 IFC 生成工程量数据</sub> | 库 · TypeScript · MPL-2.0 · ★ 1.1k |
| [mlightcad CAD Viewer](https://mlightcad.com/cad-viewer/) | 纯浏览器的 DWG/DXF 查看与编辑器，不用后端转换、不用装 AutoCAD 就能打开图纸。<br><sub>场景：投标答疑时在网页里给评委看图纸；业务系统里嵌图纸预览，免去转 PDF</sub> | 库 · TypeScript · MIT · ★ 1.2k |
| [Astral3D](https://3d.astraljs.com) | 基于 Vue3 + Three.js 的国产三维引擎与编辑器，自带 BIM 轻量化、CAD 解析预览，中文文档齐全。<br><sub>场景：做施工进度、场地布置的三维展示；把 IFC 或 CAD 模型轻量化后嵌进业务系统</sub> | 库 · JavaScript · Apache-2.0 · ★ 2.5k |

---

其它分类：[招标公告与交易数据](../list/announce-data.md) · [招标文件解析与文档理解](../list/doc-parse.md) · [标书制作与文档自动化](../list/bid-doc.md) · [造价算量与清单计价](../list/cost-quantity.md) · [合规审查与围串标识别](../list/compliance.md) · [电子签章与国密](../list/esign-crypto.md) · [项目管理与协同](../list/project-mgmt.md) · [数据、AI 与检索](../list/data-ai.md) · [GIS 与空间数据](../list/geo-space.md) · [通用办公与文档工具](../list/office-toolkit.md) · [标准、数据集与学习资源](../list/learning.md)

<sub><a href="../../README.md">返回首页</a></sub>

<sub>本页由 `npm run build` 生成，请勿手改。GitHub 元数据快照 2026-10-29。</sub>
