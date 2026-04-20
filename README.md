# Self-Evolve-XTechMan

> 基于hermes agent的自主进化应用。

## 项目理念

### 核心理念

```
传统模式:  用户反馈 → 开发者分析 → 开发者编码 → 发布更新
自主进化:  用户反馈 → Agent理解 → Agent开发 → 自动发布
```

## 自主进化循环

基于hermes agent的四阶段架构：

```
Phase 0: 完整性检查
    → 检查必需文件、测试通过、Git干净
    → 测试失败 → 阻止继续，优先修复
    → 检查失败 → 自愈恢复

Phase 1: Assess（评估）
    → 身份组装：IDENTITY + PERSONALITY + 跨会话记忆 + 最近历史
    → 读取外部信号（GitHub Issues）
    → 生成候选任务（最多3个）
    → 选择一个任务执行

Phase 2: Evolve（进化）
    → 先写测试，再写功能
    → 验证：运行 test/lint/build
    → 测试门控：测试必须通过才能提交
    → 失败 → 回滚，记录原因
    → 成功 → 提交代码

Phase 3: Communicate（沟通）
    → 写 journal（每次会话必写）
    → 写 learning（如有新洞察）
    → 检查合成需求 → 更新活跃上下文
    → 更新 session 计数
```

### 两层记忆系统

| 层级 | 文件 | 时机 |
|-----|------|------|
| 归档层 | `learnings.jsonl` | Phase 3 写入（只追加） |
| 活跃上下文层 | `active_learnings.md` | Phase 1 读取，Phase 3 合成 |

时间加权压缩：近期完整 → 中期压缩 → 远期聚合

### 三层约束体系

| 约束层 | 管控什么 |
|-------|---------|
| 技术约束 | 如何改变（测试门控、Guarded Files） |
| 经济约束 | 改变多少（每个 session 最多 3 任务） |
| 社会约束 | 为什么改变（外部信号消除决策成本） |

## 技术架构

### 基础设施
- **微信小程序框架** - 原生开发，无第三方依赖
- **Hermes Agent** - 自主进化的智能引擎
- **Git版本控制** - 每次进化都有完整追溯

### 当前功能
- 📅 日历视图（月/周切换）
- ✏️ 事件管理（添加/编辑/删除）
- 🎨 简洁设计（cc-design风格）

### 进化方向
Agent 会根据以下信号自主决定进化方向：
- 用户使用数据分析
- 微信小程序平台新能力
- 社区最佳实践
- 性能优化机会

## 开发模式

### 传统参与
欢迎人类开发者提交 Issue 和 PR，Agent 会学习这些反馈。

### Agent 自主
主要开发工作由 Hermes Agent 完成：
- 代码质量由测试保障
- 架构演进由数据驱动
- 功能迭代由用户需求引导

## 项目状态

🚧 **实验阶段** - 探索 AI Agent 驱动的软件开发新模式

当前版本专注于日历核心功能，验证自主进化的可行性。

## 相关资源

- [Hermes Agent](https://github.com/NousResearch/Hermes-Agent) - 底层智能引擎
- [yoyo-evolve](https://github.com/yologdev/yoyo-evolve) - 自主进化理念启发
- [agentskills.io](https://agentskills.io) - 开放技能标准

---