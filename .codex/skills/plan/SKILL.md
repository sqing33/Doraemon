---
name: plan
description: 使用仓库内的模板生成计划（Plan）与 Issue CSV（可选），并提供校验脚本。
metadata:
  short-description: Repo plan + Issue CSV 合约
---

# Plan（仓库内）

为本仓库生成结构化计划（Plan），并在需要时生成对应的 Issue CSV（执行合约）。

## 核心规则
- 使用 `assets/_template.md` 作为计划结构，并填写每个章节。
- 规划阶段不要改代码；先在对话中输出草案，确认后再落盘。
- 计划文件保存到仓库 `plan/` 目录（不要写到 `~/.codex/plans`）。
- 文件命名规则：`plan/YYYY-MM-DD_HH-mm-ss-<slug>.md`
- 计划中必须包含匹配的 Issue CSV 路径：`issues/YYYY-MM-DD_HH-mm-ss-<slug>.csv`
- 选择 MCP 工具时，以 `docs/mcp-tools.md` 为准，使用正确的工具名（必要时写明 `server:tool` 或运行时工具名）。

## 澄清问题
- 若需求不清晰，最多问 2 个澄清问题；否则写明假设并继续。
- 若任务跨多轮，请重新触发本技能以保持规则生效。

## 计划工作流（推荐）
1) 复述任务目标 + 假设。
2) 在对话中按模板输出计划正文（不含 frontmatter）。
3) 询问确认："回复 CONFIRM 以写入计划文件。"
4) 用户确认后写文件：
   - `python3 .codex/skills/plan/scripts/create_plan.py --task "<短标题>" --complexity <simple|medium|complex> --template`
   - 或使用 `--body-file`/stdin 提供正文（注意正文不含 frontmatter）。
5) 如需查看已有计划：
   - 列表：`python3 .codex/skills/plan/scripts/list_plans.py`
   - 读取 frontmatter：`python3 .codex/skills/plan/scripts/read_plan_frontmatter.py <plan.md>`

## Issue CSV（执行合约）
- Issue CSV 建议在计划确认后生成。
- 使用 `assets/_template.csv` 并填写 **所有** 字段；字段含义见 `issues/README.md`。
- 生成脚本（可选）：`python3 .codex/skills/plan/scripts/create_issues_csv.py --plan <plan.md>`
- 校验脚本：`python3 .codex/skills/plan/scripts/validate_issues_csv.py <issues.csv>`
- 若校验失败，修复 CSV 后再次校验直至通过。

