# Session 2 变更 — 2026-04-20 17:15

## 任务
添加农历显示功能

## 实现步骤

1. **调研** — 选择 `lunar-javascript` 库（周下载量 16.1K，无第三方依赖）
2. **先写测试** — 创建 test/lunarUtil.test.js（5 tests）
3. **实现** — 创建 utils/lunarUtil.js 工具函数
4. **安装依赖** — npm install lunar-javascript
5. **扩展 dateUtil** — 添加 lunarDay 字段到日历网格
6. **修改 WXML** — 显示农历日期
7. **修改 WXSS** — 添加农历样式（调整格子高度，添加农历文字样式）
8. **验证** — 测试全部通过（44 tests）
9. **提交** — Session 2: 添加农历显示功能

## 文件变更

| 文件 | 变更 |
|-----|------|
| utils/lunarUtil.js | 新增 |
| test/lunarUtil.test.js | 新增 |
| utils/dateUtil.js | 扩展（添加 lunarDay） |
| components/calendar-component.wxml | 添加农历显示 |
| components/calendar-component.wxss | 添加农历样式 |
| package.json | 添加 lunar-javascript 依赖 |

## 测试结果

- 测试数量：39 → 44
- 全部通过：PASS

## 技术细节

- lunar-javascript 用负数表示闰月（-2表示闰二月）
- 初一显示月份，节气优先显示，其他日期显示农历日
- 格子高度从 80rpx 增至 100rpx 以容纳农历文字