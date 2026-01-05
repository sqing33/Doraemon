# Issue CSV 规则

本仓库使用 Issue CSV 作为每个计划（Plan）的执行合约。

## 必填列（Required columns）
所有列都必须存在且每行都必须填写：
- ID：唯一 issue ID（例如 A1、A2…）
- Title：短标题
- Description：范围/边界（做什么、不做什么）
- Acceptance：完成判定标准（验收口径）
- Test_Method：如何验证（命令/工具/手工步骤）
- Tools：要用的工具（MCP/CLI/手工）；MCP 工具请参考 `docs/mcp-tools.md`
- Dev_Status：TODO | DOING | DONE
- Review1_Status：TODO | DOING | DONE（实现后按 Test_Method 验证）
- Regression_Status：TODO | DOING | DONE（所有事项完成后的回归/冒烟）
- Files：涉及的路径或范围（无则用哨兵值）
- Dependencies：依赖的其他 ID 或外部依赖（无则写 `none`）
- Notes：额外上下文（无则写 `none`）

## 哨兵值（Sentinel values）
当字段必须填但不适用时使用：
- Files：`N/A` | `external` | `TBD` | `module:<name>` | `<glob>`
- Dependencies：`none`
- Notes：`none`
- Tools：`manual` | `none`

## Test_Method 指南
每个 Issue 必须明确写出验证方式，优先选择最小且可靠的方法：
- 单元/集成：若存在测试体系且变更偏逻辑。
- API/契约：后端变更（例如 `curl`、Postman、脚本）。
- UI/E2E：前端流程（例如 Playwright/Chrome DevTools MCP）。
- 手工：仅在自动化不现实时使用，并写清楚可复现步骤。

Review 状态含义：
- Review1_Status：该 Issue 实现后进行验证。
- Regression_Status：所有 Issue 完成后进行全量回归/冒烟。
只有在声明的 Test_Method 实际运行并通过后，才可标记为 DONE；若不可行需在 Notes 中记录风险与原因。

## CSV 格式
- 字段包含逗号时用双引号包裹。
- 同一字段要列多个值时用 `|` 分隔。

## 示例
ID,Title,Description,Acceptance,Test_Method,Tools,Dev_Status,Review1_Status,Regression_Status,Files,Dependencies,Notes
A1,登录错误处理,"处理 /auth/login 的无效 token","返回 401 + error code","curl + 断言响应码","manual",TODO,TODO,TODO,"doraemon-nodejs/controllers/auth.js",none,none

