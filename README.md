# gin_data-visualization-web-ui

基于 Vue3 + TypeScript + Element Plus + Gin 的数据可视化后台管理系统前端项目。

## 项目概述

gin_data-visualization-web-ui 是一个现代化的数据可视化后台管理系统前端项目，采用 Vue 3 组合式 API 和 TypeScript 开发，结合 Element Plus UI 组件库，提供丰富的图表展示和用户管理功能。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **构建工具**: Vite 3
- **HTTP客户端**: Axios
- **图表库**: ECharts + Vue-Echarts
- **富文本编辑器**: WangEditor

## 项目结构

```
gin_data-visualization-web-ui/
├── src/                           # 源代码目录
│   ├── api/                       # API 接口管理
│   │   ├── user.ts               # 用户相关API
│   │   └── index.ts              # API统一导出
│   ├── assets/                   # 静态资源
│   │   ├── img/                  # 图片资源
│   │   │   ├── logo.svg          # 项目Logo
│   │   │   └── login-bg.jpg      # 登录页背景图
│   │   └── css/                  # 样式文件
│   ├── components/               # 公共组件
│   │   ├── charts/               # 图表组件
│   │   ├── editor/               # 编辑器组件
│   │   ├── upload/               # 上传组件
│   │   └── layout/               # 布局组件
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义
│   ├── store/                    # 状态管理
│   │   └── user.ts               # 用户状态管理
│   ├── types/                    # TypeScript类型定义
│   │   ├── user.ts               # 用户相关类型
│   │   └── index.ts              # 类型统一导出
│   ├── utils/                    # 工具函数
│   │   ├── index.ts              # 工具函数统一导出
│   │   ├── encrypt.ts            # 加密工具函数
│   │   ├── request.ts            # HTTP请求封装
│   │   └── china.ts              # 中国地区数据
│   ├── views/                    # 页面组件
│   │   ├── pages/                # 页面级组件
│   │   │   ├── login.vue         # 登录页面
│   │   │   ├── register.vue      # 注册页面
│   │   │   └── dashboard.vue     # 仪表板页面
│   │   └── layout/               # 布局页面
│   ├── App.vue                   # 应用根组件
│   ├── main.ts                   # 应用入口文件
│   └── vite-env.d.ts             # Vite类型声明
├── public/                       # 公共静态资源
├── node_modules/                 # 项目依赖包
├── index.html                    # HTML入口文件
├── package.json                  # 项目配置和依赖
├── vite.config.ts               # Vite配置文件
├── tsconfig.json                # TypeScript配置
└── README.md                    # 项目说明文档
```

## 目录详细说明

### src/ 源代码目录

#### api/ - API接口管理
- **user.ts**: 用户相关的API接口定义（登录、注册、用户信息等）
- **index.ts**: API接口的统一导出和管理

#### assets/ - 静态资源
- **img/**: 图片资源目录
  - logo.svg: 项目Logo图标
  - login-bg.jpg: 登录页面背景图片
- **css/**: 样式文件目录

#### components/ - 公共组件
- **charts/**: 图表相关组件，基于ECharts封装
- **editor/**: 富文本和Markdown编辑器组件
- **upload/**: 文件上传组件，支持拖拽和裁剪
- **layout/**: 布局相关组件

#### router/ - 路由配置
- **index.ts**: Vue Router路由配置，定义页面路由和权限控制

#### store/ - 状态管理
- **user.ts**: 用户状态管理，包括用户信息、登录状态等

#### types/ - 类型定义
- **user.ts**: 用户相关的TypeScript类型定义
- **index.ts**: 类型统一导出文件

#### utils/ - 工具函数
- **index.ts**: 工具函数统一导出文件
- **encrypt.ts**: 加密工具函数，包含SHA-256密码加密功能
- **request.ts**: HTTP请求封装，包含拦截器和错误处理
- **china.ts**: 中国地区数据工具函数

#### views/ - 页面组件
- **pages/**: 页面级组件
  - login.vue: 用户登录页面
  - register.vue: 用户注册页面（包含密码SHA-256加密功能）
  - dashboard.vue: 数据仪表板页面
- **layout/**: 布局页面组件

### 根目录文件

- **App.vue**: Vue应用根组件，包含全局布局和路由视图
- **main.ts**: 应用入口文件，初始化Vue应用和全局配置
- **vite-env.d.ts**: Vite环境类型声明文件
- **index.html**: HTML入口文件
- **package.json**: 项目配置和依赖管理
- **vite.config.ts**: Vite构建工具配置
- **tsconfig.json**: TypeScript编译配置

## 主要功能特性

### 用户管理
- 用户注册（前端SHA-256加密 + 后端bcrypt加密）
- 用户登录和权限验证
- 用户信息管理

### 数据可视化
- 丰富的图表展示（柱状图、折线图、饼图等）
- 实时数据更新
- 图表自定义配置

### 系统功能
- 响应式布局设计
- 主题切换功能
- 权限管理系统
- 文件上传和管理

## 安装和运行

### 环境要求
- Node.js 14.18+ 
- npm 6.0+

### 安装步骤

```bash
# 克隆项目
git clone <项目地址>

# 进入项目目录
cd gin_data-visualization-web-ui

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 开发服务器
项目启动后，访问 http://localhost:5173 查看应用。

## 安全特性

### 密码加密流程
1. **前端加密**: 使用SHA-256算法对用户密码进行加密
2. **安全传输**: 加密后的密码传输到后端
3. **后端存储**: 后端使用bcrypt算法再次加密存储

### 加密工具
- 位于 `src/utils/encrypt.ts`
- 使用Web Crypto API实现安全的SHA-256加密
- 支持浏览器兼容性检测

## 开发规范

### 代码规范
- 使用TypeScript进行类型安全开发
- 遵循Vue 3组合式API规范
- 使用ESLint + Prettier进行代码格式化

### 目录规范
- 组件采用PascalCase命名
- 工具函数采用camelCase命名
- 页面文件使用kebab-case命名

## 部署说明

### 构建生产版本
```bash
npm run build
```
构建完成后，`dist`目录包含所有静态资源文件。

### 服务器部署
将`dist`目录下的文件部署到Web服务器（如Nginx、Apache等）。

