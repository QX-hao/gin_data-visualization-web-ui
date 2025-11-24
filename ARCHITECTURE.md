# DataViz Pro 完整系统架构说明

## 系统架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  前端应用 (HTML/CSS/JS)              │   │
│  │  login.html  →  dashboard.html  →  admin-dashboard   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │  HTTP/HTTPS 请求
                 │  + SHA-256 密码哈希
                 │  + JWT Token认证
                 ↓
┌────────────────────────────────────────────────────────────┐
│                   后端 API 服务器                           │
│           (需要按 BACKEND_REQUIREMENTS.md 实现)             │
│  ┌────────────────────────────────────────────────────┐    │
│  │           /api/v1 - REST API Endpoints             │    │
│  │                                                    │    │
│  │  /auth/*           - 认证相关接口                 │    │
│  │  /public/*         - 公开接口                     │    │
│  │  /protected/*      - 受保护接口                   │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │         bcrypt 密码加密 + JWT 令牌管理             │    │
│  │         用户认证 + 权限控制                        │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
        ┌─────────────────┐
        │   数据库        │
        │  (MySQL/Postgres)│
        │  users          │
        │  sessions       │
        │  dashboards     │
        │  datasources    │
        └─────────────────┘
```

## 用户登录流程

```
┌─────────┐
│ 用户    │
└────┬────┘
     │ 1. 打开 login.html
     ↓
┌──────────────────────────┐
│  登录/注册表单           │
│  - 实时用户名/邮箱验证   │
│  - 密码强度检查          │
└────┬─────────────────────┘
     │ 2. 输入账户密码
     │
     ↓
┌──────────────────────────┐
│ 前端加密 (crypto-utils) │
│ password → SHA-256 hash  │
└────┬─────────────────────┘
     │ 3. 发送请求
     ↓
┌────────────────────────────┐
│ POST /api/v1/auth/login    │
│ {username, password_hash}  │
└────┬───────────────────────┘
     │ 4. 网络传输
     ↓
┌──────────────────────────┐
│  后端验证                │
│  1. 查找用户             │
│  2. bcrypt 对比密码      │
│  3. 生成 JWT Token       │
└────┬─────────────────────┘
     │ 5. 返回响应
     ↓
┌──────────────────────────┐
│ {access_token, user}     │
└────┬─────────────────────┘
     │ 6. 保存到 localStorage
     │ - jwt_token
     │ - current_user
     ↓
┌──────────────────────────┐
│ 检查用户角色             │
├──────────────────────────┤
│ user_type = 'app'        │
│ ↓ 跳转到 dashboard       │
│                          │
│ user_type = 'system'     │
│ ↓ 跳转到 admin-dashboard │
└──────────────────────────┘
```

## 权限控制架构

```
┌─────────────────────────────────────┐
│         认证 (Authentication)       │
│  是否提供了有效的 JWT Token？        │
│  ↓                                  │
│  ✓ Token 有效 → 继续请求            │
│  ✗ 无效/过期  → 重定向到登录页      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         授权 (Authorization)        │
│  该用户有权访问此资源吗？           │
│  ↓                                  │
│  普通用户 (app)                    │
│  ├─ 查看自己的资料                  │
│  ├─ 修改自己的密码和邮箱           │
│  ├─ 访问 dashboard.html            │
│  └─ 不能访问 admin-dashboard.html  │
│                                     │
│  系统管理员 (system)                │
│  ├─ 做普通用户能做的一切            │
│  ├─ 管理所有用户                    │
│  ├─ 管理看板和数据源               │
│  ├─ 查看访问日志                    │
│  ├─ 修改任意用户密码               │
│  └─ 访问 admin-dashboard.html      │
└─────────────────────────────────────┘
```

## 文件模块说明

### 1. `login.html` - 认证入口
```
功能：
- 用户注册表单
  ├─ 用户名验证（3-20字符）
  ├─ 邮箱验证
  ├─ 密码强度检查
  ├─ 实时用户名/邮箱可用性检查
  └─ 用户协议确认
  
- 用户登录表单
  ├─ 用户名/邮箱登录
  ├─ 密码输入
  ├─ 记住我功能
  └─ 忘记密码链接
  
- 忘记密码流程
  ├─ 步骤1：输入邮箱，请求重置
  ├─ 步骤2：输入验证码和新密码
  └─ 步骤3：确认成功，返回登录

数据存储：
- localStorage.jwt_token         (JWT令牌)
- localStorage.current_user      (用户信息)
- localStorage.remembered_username (记住的用户名)
- localStorage.server_url        (服务器地址)
```

### 2. `dashboard.html` - 普通用户首页
```
功能：
- 欢迎面板
  ├─ 显示登录用户信息
  ├─ 快速导航
  └─ 系统提示

- 数据看板管理
  ├─ 创建新仪表板
  ├─ 查看我的看板
  ├─ 导入数据
  └─ 数据分析

- 账户管理（右上角用户菜单）
  ├─ 账户设置
  │  ├─ 基本资料（用户名、邮箱）
  │  └─ 安全设置（修改密码）
  └─ 退出登录

权限检查：
- 只有 user_type = 'app' 的用户才能访问
- 验证 localStorage 中的 jwt_token
```

### 3. `admin-dashboard.html` - 系统管理员后台
```
功能：
- 管理仪表板
  ├─ 统计数据展示
  │  ├─ 活跃用户数
  │  ├─ 已发布看板数
  │  ├─ 数据源连接数
  │  └─ 今日请求数
  └─ 系统信息

- 用户管理
  ├─ 查看用户列表
  ├─ 创建新用户
  ├─ 编辑用户信息
  ├─ 删除用户
  ├─ 批量导入用户
  ├─ 导出用户数据
  └─ 修改用户密码（不需要原密码）

- 看板管理
  ├─ 查看看板列表
  ├─ 创建新看板
  ├─ 编辑看板
  └─ 发布/下线看板

- 数据源管理
  ├─ 配置数据连接
  ├─ 测试连接
  └─ 删除数据源

- 访问日志
  ├─ 查看操作日志
  ├─ 按用户搜索
  ├─ 按日期筛选
  └─ 导出日志

权限检查：
- 只有 user_type = 'system' 的用户才能访问
```

### 4. `crypto-utils.js` - 加密工具库
```javascript
class CryptoUtils {
  // SHA-256 密码哈希
  static async sha256(message)
  
  // 密码强度检查
  static checkPasswordStrength(password)
    → {score: 0-4, message: string, percentage: number}
  
  // 格式验证
  static isValidPassword(password)      // 8-20位，字母+数字
  static isValidUsername(username)      // 3-20字符，字母/数字/下划线
  static isValidEmail(email)            // 标准邮箱格式
}
```

### 5. `auth-system.js` - 认证系统核心
```javascript
class AuthSystem {
  // 切换登录/注册表单
  toggleForm()
  
  // 处理登录
  async handleLogin(e)
  
  // 处理注册
  async handleRegister(e)
  
  // 实时验证用户名/邮箱
  async checkUsername(username)
  async checkEmail(email)
  
  // 密码强度检查
  checkPasswordStrength(password)
  
  // 忘记密码流程
  showForgotPasswordModal()
  async submitForgotPassword()
  
  // 通用API调用
  async callApi(endpoint, method, data)
  
  // 根据用户角色重定向
  redirectToDashboard()
}
```

### 6. `dashboard-app.js` - 普通用户应用
```javascript
class DashboardApp {
  // 账户管理
  openAccountSettings()
  async updateProfile()
  async submitChangePassword()
  
  // 仪表板操作
  createDashboard()
  viewMyDashboards()
  goToAnalytics()
  importData()
  
  // 用户操作
  async logout()
  viewNotifications()
  getHelp()
}
```

### 7. `admin-app.js` - 管理员应用
```javascript
class AdminApp {
  // 导航
  switchSection(sectionName)
  
  // 数据加载
  loadDashboardData()
  async loadUsers()
  async loadDashboards()
  async loadDataSources()
  async loadLogs()
  
  // 用户管理
  createUser()
  async submitCreateUser(username, email, password)
  editUser(userId)
  deleteUser(userId)
  importUsers()
  exportUsers()
  
  // 管理操作
  createDashboard()
  addDataSource()
  openSettings()
  async logout()
}
```

## 数据流示例

### 注册流程
```
用户点击注册
  ↓
前端验证表单
  ├─ 用户名：3-20字符
  ├─ 邮箱：标准格式
  ├─ 密码：8-20位，字母+数字
  └─ 同意协议
  ↓
前端检查可用性（可选）
  ├─ POST /auth/check-username
  └─ POST /auth/check-email
  ↓
前端对密码进行 SHA-256 哈希
  ↓
发送注册请求
  POST /api/v1/auth/register
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "a1b2c3d4e5...", // SHA-256 hash
    "user_type": "app"
  }
  ↓
后端处理
  ├─ 验证用户名/邮箱是否已存在
  ├─ 用 bcrypt 加密密码哈希
  ├─ 在数据库创建新用户
  └─ 返回成功响应
  ↓
前端显示成功消息
  ↓
自动跳转回登录页
  ↓
用户使用新账户登录
```

### 修改密码流程
```
用户打开账户设置
  ↓
填写当前密码、新密码、确认密码
  ↓
前端验证
  ├─ 新密码格式：8-20位，字母+数字
  ├─ 新密码和确认密码一致
  └─ 当前密码不为空
  ↓
前端分别对两个密码进行 SHA-256 哈希
  current_password_hash = SHA256(user_input)
  new_password_hash = SHA256(new_input)
  ↓
发送修改请求
  PUT /api/v1/protected/users/password
  {
    "old_password": "old_hash_value",
    "new_password": "new_hash_value"
  }
  ↓
后端处理
  ├─ 使用 bcrypt.compare() 验证 old_password
  ├─ 使用 bcrypt.hash() 加密 new_password
  ├─ 更新数据库
  └─ 返回成功响应
  ↓
前端显示成功消息
  ↓
清空表单并关闭弹窗
```

## 安全机制

### 1. 密码双重加密
```
原始密码
  ↓ (SHA-256)
前端哈希值 (用于网络传输)
  ↓ (HTTP/网络传输)
后端接收
  ↓ (bcrypt)
最终存储值 (用于数据库存储)
```

### 2. JWT Token 管理
```
前端保存：localStorage.jwt_token
每次请求时在请求头中附加：Authorization: Bearer <token>
后端验证：
  ├─ 检查签名
  ├─ 检查过期时间
  └─ 提取用户信息
```

### 3. 权限控制
```
认证层：验证 Token 是否有效
  ↓
授权层：检查用户角色和权限
  ├─ app  : 访问个人页面
  └─ system: 访问管理后台
```

## 错误处理

```
API 请求失败
  ↓
检查 HTTP 状态码
  ├─ 401: Token 过期 → 重定向到登录页
  ├─ 403: 权限不足 → 显示禁止访问提示
  ├─ 404: 资源不存在 → 显示不存在提示
  └─ 5xx: 服务器错误 → 显示错误信息
  ↓
显示用户友好的错误消息
  ↓
记录错误到浏览器控制台
```

## 性能优化建议

1. **代码分割**: 分离不同页面的代码
2. **缓存策略**: 缓存用户信息和用户列表
3. **压缩资源**: 压缩 HTML/CSS/JS 文件
4. **CDN加速**: 使用 CDN 提供静态资源
5. **懒加载**: 延迟加载非关键资源
6. **请求合并**: 合并多个 API 请求

---

**架构版本**: 1.0  
**最后更新**: 2024-01-15
