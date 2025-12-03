# Gin Data Visualization Web UI

基于 Vue 3 + Vite + Pinia + Element Plus 的后台管理系统前端项目，配合 Go (Gin) 后端实现完整的数据可视化与管理功能。

## 项目简介

本项目是 [vue-manage-system](https://github.com/lin-xin/vue-manage-system) 的定制版本，主要用于对接 `gin_data-visualization` 后端服务。项目集成了丰富的前端组件和图表库，提供了一套完整的后台管理解决方案。

## 功能特性

*   **用户管理**：登录、注册、个人中心、用户/角色/菜单管理。
*   **数据可视化**：集成 ECharts 和 Schart，支持多种图表展示。
*   **表格操作**：支持基础表格、可编辑表格、Excel 导入导出。
*   **表单组件**：集成富文本编辑器 (WangEditor)、Markdown 编辑器。
*   **系统功能**：支持主题切换、全屏、国际化（部分）、标签页导航。
*   **权限控制**：基于角色的权限管理 (RBAC) 实现。

## 技术栈

*   **核心框架**: Vue 3
*   **构建工具**: Vite
*   **UI 组件库**: Element Plus
*   **状态管理**: Pinia
*   **路由管理**: Vue Router
*   **HTTP 客户端**: Axios
*   **图表库**: ECharts, Vue-Schart
*   **语言**: TypeScript

## 目录结构说明

```text
src/
├── api/                # 后端 API 接口定义
├── assets/             # 静态资源文件 (图片, 样式等)
├── components/         # 公共组件 (Header, Sidebar, Tags 等)
├── router/             # 路由配置
├── store/              # Pinia 状态管理 (用户状态, 权限, 标签页等)
├── utils/              # 工具函数 (Axios 封装, 格式化等)
├── views/              # 页面视图组件
│   ├── chart/          # 图表页面
│   ├── dashboard.vue   # 系统首页
│   ├── element/        # Element Plus 示例组件
│   ├── pages/          # 通用页面 (登录, 注册, 404 等)
│   ├── system/         # 系统管理页面 (用户, 角色, 菜单)
│   └── table/          # 表格相关页面
└── App.vue             # 根组件
```

## 快速开始

### 1. 安装依赖

确保本地已安装 Node.js (推荐 v16+)。

```bash
npm install
```

### 2. 开发环境运行

启动开发服务器（默认端口可能为 5173 或 8080）：

```bash
npm run dev
```

### 3. 构建生产环境

```bash
npm run build
```

## 后端对接

本项目默认配置对接本地 Go 后端服务。

*   **API Base URL**: `http://localhost:1234/api/v1`
*   **配置文件**: `src/utils/request.ts`

如果需要修改后端地址，请更新 `src/utils/request.ts` 中的 `baseURL` 配置。

---

## 原项目鸣谢

本项目基于 [vue-manage-system](https://github.com/lin-xin/vue-manage-system) 二次开发。感谢原作者提供的优秀模板。
