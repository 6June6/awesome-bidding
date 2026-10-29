# 维护者手册

给已经拿到写权限的人看的。普通贡献者只需要 [CONTRIBUTING.md](../CONTRIBUTING.md)。

维护者的核心工作只有三件：**评审 PR、清死链、裁决分类**。加起来每周半小时到一小时。

---

## 每周固定动作

### 1. 清死链

```bash
npm run link-check
```

看 `data/link-status.json` 的 `summary`：

| 状态 | 含义 | 你要做什么 |
| --- | --- | --- |
| `ok` | 正常 | 不用管 |
| `blocked` | 403/412/521 等，多为政府站 WAF | **手动点开几个**，浏览器能开就没事；确实要登录才拒的，在 `notes` 里注明 |
| `dead` | 404/410/DNS 不存在 | 必须处理，见下 |
| `unknown` | 5xx/超时 | 隔周再看，连续两次异常再处理 |

处理 `dead` 的优先级：**找新地址 → 标记 archived → 删除**。项目搬家很常见，先搜索再删。

提交巡检结果：

```bash
git add data/link-status.json
git commit -m "chore: 链接巡检 $(date +%F)"
```

> 注意：巡检结果只有「确认死亡」时才值得单独 commit。blocked/unknown 的波动不值得进 git。

### 2. 对齐元数据

```bash
GITHUB_TOKEN=xxx npm run enrich
```

配了 token 才不会被限流（匿名 60 次/小时）。它会报两类差异：

- **许可不一致**：GitHub 说的和你写的不一样。多数情况是 GitHub 记错了（`NOASSERTION` 已被过滤），但**这条看一下**，写错的许可是会害人的。
- **仓库已归档**：加 `archived: true`。

### 3. 过一遍 PR

用下面的清单，可以直接复制到 PR 里回复。

---

## PR 评审清单

```markdown
- [ ] 符合 [收录标准](docs/criteria.md)（相关、可获取、能用、有人维护）
- [ ] 描述说清了「是什么 + 解决哪一步」，不是营销词
- [ ] 分类归属正确（一条只归一个）
- [ ] `repo` / `homepage` 是项目自己的地址
- [ ] 不与已有条目重复
- [ ] 许可填写合理，有坑的写进 notes
- [ ] 只加了一个条目，没有顺手改别的
- [ ] CI 全绿（validate + build:check）
```

**合并动作**：

```bash
# 本地拉下来验证一遍（比只看 CI 靠谱）
npm run validate && npm run build
git add -A && git commit -m "merge: <项目名> (#123)"
```

或者直接点 GitHub 的 squash merge——只要 CI 绿了，两种都行。

### 常见要打回的

- 描述是「功能强大、性能优异」→ 请对方按描述写法重写
- `featured: true` → 改回 false（精选是维护者权力，避免自我推荐失控）
- 一条 PR 五个条目 → 请拆分
- 商业 SaaS 无免费层 → 拒，说明见 criteria

---

## 处理分类争议

有人提「这个应该归 X 不归 Y」时：

1. 先问：[taxonomy 的决策树](taxonomy.md#判不准时的决策树)走一遍能不能得出结论
2. 能 → 直接改，回一句为什么
3. 不能 → 按 [GOVERNANCE](GOVERNANCE.md#争议裁决) 走，**结论要写回 taxonomy.md**，下次就不用再吵

**分类变更必须同步做这三件事**：改条目 `category` → 跑 `npm run build` → 删除 `docs/list/` 下已废弃的页面。

---

## 每月看一眼

- `dist/index.json` 的条目数是否在增长（不增长说明推广没做到位）
- 各分类数量是否失衡（某类 30 条、某类 1 条，考虑拆分或合并）
- `data/metrics.json` 里 star 极低但仍在列表里的，看描述是否写得太空

---

## 安全事件处理

发现某条目被投毒（仓库被接管、安装包被换）：

1. **先摘掉**：把该条目从 `data/entries/` 删除，立即 commit + push。不要等讨论。
2. 在仓库的 Security advisory 里记录（不要开公开 issue 细节）。
3. 如果条目在列表里超过 30 天且有人引用过，在 issue 里公开说明。
4. 复盘：这类工具是否需要额外的收录要求（比如要求有签名发布）。

参考 [SECURITY.md](../SECURITY.md)。

---

## 版本与发布

这个仓库**不做版本发布**。`dist/index.json` 是持续更新的快照，消费方自己决定什么时候拉。

`data/metrics.json` 与 `data/link-status.json` 是缓存，允许不同步、允许过期，不需要为它们单独发版。

---

## 交接

维护者退出时：

1. 在 GOVERNANCE.md 里把自己移到「荣誉维护者」
2. 移交 GitHub 权限
3. 如果手上有未完成的分类重构，写进 issue

---

## 反模式（别做这些）

- **为了数量收录**：列表变长不等于变好，读者会失去信任
- **凭印象改描述**：改别人的描述要基于实测，不然就是在制造错误信息
- **手改 README/docs/list**：下次 `npm run build` 就覆盖了，而且 CI 会红
- **跳过 CI 强推**：`build:check` 拦的正是「数据改了产物没更新」，跳过等于让下一个人面对不一致的仓库
- **给 star 数当门槛**：20 star 但解决问题的小工具，比 5 万 star 的通用框架更有价值
