# AGENTS（仓库协作规则）

> 目标：让 Codex 在本仓库中以一致、可复现的方式执行复杂任务（计划 → 合约 → 实现 → 验证）。

## 优先级
1. 正确性与安全性优先于速度。
2. 先明确范围与验收标准，再改代码。
3. 能自动化验证就不要只口头描述。
4. 变更尽量小、可审查、可回滚。

## 项目结构

本仓库是一个小型全栈应用：

- `doraemon-nodejs/`：Express 后端（路由在 `routes/`，处理逻辑在 `controllers/`，数据库在 `db/`，视图在 `views/`，静态资源/上传在 `public/`）。
- `doraemon-vue/`：Vue 3 + TypeScript 前端（入口 `src/main.ts`，路由在 `src/router/`，功能 UI 在 `src/components/`）。
- `doraemon.sql`：MySQL 表结构 + 种子数据（用于初始化本地数据库）。
- `Dockerfile`、`docker-compose.yml`：容器构建/运行（Compose 挂载 `./uploads` 与 `./logs`）。

## 常用开发命令

后端（API 服务，默认 `PORT=3000`）：

```bash
cd doraemon-nodejs
npm install
npm start
```

前端（Vite 开发服务器，通常为 `http://localhost:5173`）：

```bash
cd doraemon-vue
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

数据库初始化：

```bash
mysql -u <user> -p < doraemon.sql
```

Docker（偏生产化运行；如需使用本地构建镜像请调整 `docker-compose.yml`）：

```bash
docker build -t doraemon .
docker compose up -d
```

## E2E 闭环

E2E 闭环 = 计划（plan）→ 合约（issues）→ 实现 → 测试 → 评审 → 提交 → 回归

## 计划与 Issue CSV（执行合约）

- 使用仓库内的 `plan` 技能生成计划与 Issue CSV（文件在 `.codex/skills/plan/`）。
- 计划落盘路径：`plan/YYYY-MM-DD_HH-mm-ss-<slug>.md`
- Issue CSV 路径：`issues/YYYY-MM-DD_HH-mm-ss-<slug>.csv`（必须与计划的时间戳/slug 一致）
- 生成计划文件：
  - `python3 .codex/skills/plan/scripts/create_plan.py --task "<短标题>" --complexity <simple|medium|complex> --template`
- 生成 Issue CSV（可选）：
  - `python3 .codex/skills/plan/scripts/create_issues_csv.py --plan <plan.md>`
- 校验 Issue CSV：
  - `python3 .codex/skills/plan/scripts/validate_issues_csv.py <issues.csv>`

Issue CSV 列定义与填写要求见：`issues/README.md`。

## MCP 工具目录

可用 MCP 工具与服务器清单见：`docs/mcp-tools.md`。

## 代码风格与命名

- JavaScript/TypeScript：保持与所在文件的既有风格一致（仓库内缩进可能不统一）。
- 命名：优先清晰、可读（例如 `getUserById`、`newsService`、`AnimeDetail.vue`）。
- 前端：组件放在 `doraemon-vue/src/components/<feature>/...`。
- 后端：路由模块放在 `doraemon-nodejs/routes/`，对应逻辑放在 `controllers/`/`services/`。

## 测试与验证

当前仓库没有完善的自动化测试体系。涉及行为变更时：

- 做一次快速的手工冒烟：启动后端 + 前端，走一遍受影响的流程。
- 如果新增测试，请就近放置（例如 `src/**/__tests__`），并在 PR 中说明如何运行。

## 工具使用原则

- 优先使用本地可用命令与脚本；需要浏览器/外部系统时再用 MCP。
- 有匹配的 MCP 工具就用工具，不要“脑补结果”。
- Issue CSV 的 `Tools` 字段应指明要用的工具或方式（如 `manual`/`none`），并与实际执行一致。
- 未实际运行的验证不要声称“已通过”。

## 提交与 PR

仓库历史提交风格不统一；从现在起建议尽量保持一致：

- 尽量使用 Conventional Commits：`feat(scope): ...`、`fix(scope): ...`、`chore: ...`。
- PR 内容应包含：改了什么、如何本地验证、（若涉及前端可见变化）UI 截图。

## Git（禁止触碰）

- 禁止运行任何 `git ...` 命令（包括但不限于 `git status` / `git diff` / `git add` / `git commit` / `git push` / `git checkout` / `git reset` 等）。
- 禁止直接修改或操作 `.git/` 目录及其内容。
- 如需提交，只能在回答中给出“建议的提交信息”供你手动使用（例如 `feat(scope): ...` / `fix(scope): ...`），但 AI 本身绝不执行任何 Git 操作。

## 安全与配置

- 不要提交真实密钥；用 `.env.example` 作为模板，`.env` 仅保留在本地。
- 后端通过环境变量读取 MySQL/Redis/JWT/邮件等配置（见 `.env.example`）。

## 输出风格

- 回复尽量简洁、结构化。
- 涉及代码变更时，给出关键文件路径（建议带行号）。
- 非平凡改动需要说明：风险点 + 建议的下一步验证。
