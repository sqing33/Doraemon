# MCP 工具与服务器

本仓库可在启用 MCP（Model Context Protocol）服务器的 Codex CLI 环境中进行开发。本文件用于记录当前环境启用的 MCP 服务器，以及它们暴露的资源与工具能力概览。

## 已启用的 MCP 服务器

### `mcp-router`

聚合型 MCP 服务器，提供多类工具能力（浏览器自动化、GitHub、数据库、文档检索等）。

**发现/枚举**

- 列出资源：`list_mcp_resources`（可选传参 `server: "mcp-router"`）
- 列出资源模板：`list_mcp_resource_templates`
- 读取资源：`read_mcp_resource`

**当前可见资源**

- `resource://puppeteer/console://logs`（浏览器控制台日志）
- `resource://puppeteer/screenshot://postBlog-milkdown`（PNG 截图）

## `mcp-router` 暴露的工具族

`mcp-router` 暴露的工具数量较多。在本仓库中，你通常会用到下列几类（工具名按运行时实际名称展示）：

### 浏览器自动化（DevTools / Puppeteer 风格）

- 快照/截图：`mcp__mcp-router__take_snapshot`, `mcp__mcp-router__take_screenshot`, `mcp__mcp-router__puppeteer_screenshot`
- 导航：`mcp__mcp-router__new_page`, `mcp__mcp-router__navigate_page`, `mcp__mcp-router__puppeteer_navigate`
- 交互：`mcp__mcp-router__click`, `mcp__mcp-router__fill`, `mcp__mcp-router__press_key`, `mcp__mcp-router__upload_file`
- DevTools 数据：`mcp__mcp-router__list_console_messages`, `mcp__mcp-router__list_network_requests`, `mcp__mcp-router__get_network_request`

### GitHub

- Issue：`mcp__mcp-router__create_issue`, `mcp__mcp-router__get_issue`, `mcp__mcp-router__list_issues`, `mcp__mcp-router__add_issue_comment`
- PR：`mcp__mcp-router__create_pull_request`, `mcp__mcp-router__get_pull_request`, `mcp__mcp-router__list_pull_requests`, `mcp__mcp-router__merge_pull_request`
- 文件/分支：`mcp__mcp-router__create_branch`, `mcp__mcp-router__get_file_contents`, `mcp__mcp-router__create_or_update_file`, `mcp__mcp-router__push_files`

### PostgreSQL

- Schema：`mcp__mcp-router__pg_manage_schema`
- 索引：`mcp__mcp-router__pg_manage_indexes`
- 查询分析：`mcp__mcp-router__pg_manage_query`
- 读写：`mcp__mcp-router__pg_execute_query`, `mcp__mcp-router__pg_execute_mutation`, `mcp__mcp-router__pg_execute_sql`

### MySQL（如已配置）

- 连接：`mcp__mcp-router__connect_db`
- 查询：`mcp__mcp-router__query`
- 写入/更新：`mcp__mcp-router__execute`
- 结构查看：`mcp__mcp-router__list_tables`, `mcp__mcp-router__describe_table`

### Context7 库文档

- 解析库 ID：`mcp__mcp-router__resolve-library-id`
- 拉取文档：`mcp__mcp-router__get-library-docs`

### RepoMix（代码库打包/汇总）

- 导出：`mcp__mcp-router__getCodebase`, `mcp__mcp-router__saveCodebase`
- 远程仓库导出：`mcp__mcp-router__getRemoteCodebase`

### 笔记 / 博客（如已配置）

- SiYuan Note：`mcp__mcp-router__list_notebooks`, `mcp__mcp-router__create_document`, `mcp__mcp-router__update_document`, `mcp__mcp-router__unified_search`
- Halo 博客：`mcp__mcp-router__list_categories`, `mcp__mcp-router__list_tags`, `mcp__mcp-router__create_post`, `mcp__mcp-router__update_post`, `mcp__mcp-router__upload_attachment`

## 如何更新本文档

当启用的 MCP 服务器发生变化时，可通过以下调用重新生成“已启用的 MCP 服务器”部分：

- `list_mcp_resources`
- `list_mcp_resource_templates`
