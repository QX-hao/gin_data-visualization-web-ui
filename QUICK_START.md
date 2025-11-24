# DataViz Pro 前端快速开始指南

## 项目结构

```
gin_data-visualization-web-ui/
├── login.html                 # 登录/注册页面（入口）
├── dashboard.html             # 普通用户首页
├── admin-dashboard.html       # 系统管理员后台
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── crypto-utils.js    # 加密工具（SHA-256）
│       ├── auth-system.js     # 认证系统核心逻辑
│       ├── dashboard-app.js   # 普通用户应用逻辑
│       └── admin-app.js       # 管理员应用逻辑
├── BACKEND_REQUIREMENTS.md    # 后端接口完整要求文档
└── QUICK_START.md            # 本文档
```

## 功能概述

### 🔐 认证系统
- ✅ 用户注册（邮箱验证、密码强度检查）
- ✅ 用户登录（支持用户名/邮箱登录）
- ✅ 记住我功能
- ✅ 忘记密码功能
- ✅ SHA-256 前端密码哈希
- ✅ JWT Token 管理

### 👤 普通用户功能（`dashboard.html`）
- ✅ 个人资料管理
- ✅ 邮箱修改
- ✅ 密码修改
- ✅ 数据看板管理
- ✅ 快速操作菜单

### 👨‍💼 系统管理员功能（`admin-dashboard.html`）
- ✅ 用户管理（创建、编辑、删除用户）
- ✅ 看板管理
- ✅ 数据源管理
- ✅ 访问日志查看
- ✅ 修改任意用户密码

## 开发环境配置

### 前置要求
- 现代浏览器（Chrome, Firefox, Edge, Safari）
- Web服务器（可选，用于本地测试）
- 后端服务运行在 `http://localhost:1234`

### 启动前端
```bash
# 使用 Python 简易服务器
python -m http.server 3000

# 或使用 Node.js 的 http-server
npx http-server -p 3000

# 或使用 VS Code 的 Live Server 扩展
```

访问 `http://localhost:3000/login.html`

## 使用流程

### 1️⃣ 注册新账户
1. 打开登录页面
2. 点击"立即注册"
3. 填写用户名、邮箱、密码
4. 同意用户协议
5. 点击注册
6. 自动跳转回登录页
7. 使用新账户登录

### 2️⃣ 普通用户登录流程
1. 在登录页输入用户名/邮箱和密码
2. （可选）勾选"记住我"
3. 点击登录
4. 登录成功后自动跳转到 `dashboard.html`
5. 可以访问个人看板和修改账户信息

### 3️⃣ 系统管理员登录流程
1. 登录成功后自动检测用户类型
2. 如果是 `system` 类型，自动跳转到 `admin-dashboard.html`
3. 进入管理后台可以管理用户和看板

### 4️⃣ 修改密码
1. 登录后点击头像菜单 → "账户设置"
2. 选择"安全设置"标签
3. 输入当前密码、新密码
4. 点击"修改密码"

### 5️⃣ 忘记密码恢复
1. 在登录页点击"忘记密码？"
2. 输入注册邮箱
3. 点击"发送重置邮件"
4. 收到邮件后输入验证码和新密码
5. 点击"重置密码"完成

## 密码安全机制

### 工作流程

```
用户输入密码
     ↓
前端使用 SHA-256 哈希
     ↓
发送哈希值到后端
     ↓
后端使用 bcrypt 再次加密存储
     ↓
登录时用 bcrypt 对比
```

### 代码示例

```javascript
// 前端密码哈希（自动处理）
const hashedPassword = await CryptoUtils.hashPassword(userPassword);

// 后端应该：
// 1. 接收哈希值
// 2. 使用 bcrypt 加密存储
// 3. 登录时用 bcrypt 对比
```

## API 调用说明

### 基础URL
```javascript
baseUrl: 'http://localhost:1234'
apiBase: '/api/v1'
```

### 认证请求头
```javascript
Authorization: Bearer <access_token>
```

### 错误处理
```javascript
// 所有API调用都返回以下格式
{
  success: boolean,      // HTTP状态是否为 2xx
  status: number,        // HTTP状态码
  data: {...}           // 响应数据
}
```

## 测试账户创建

### 方式1：通过注册界面
1. 打开 `login.html`
2. 点击"立即注册"
3. 创建新账户

### 方式2：管理员创建（需要后端支持）
1. 使用管理员账户登录
2. 进入"用户管理"
3. 点击"创建新用户"
4. 输入用户信息

## 浏览器存储数据

前端使用 `localStorage` 存储以下信息：

```javascript
// JWT Token
localStorage.getItem('jwt_token')

// 当前用户信息
localStorage.getItem('current_user')
// 格式: {id, username, email, user_type, status, created_at, updated_at}

// 记住的用户名
localStorage.getItem('remembered_username')

// 服务器地址
localStorage.getItem('server_url')
```

## 常见问题

### Q: 为什么登录后自动跳转到 admin-dashboard.html？
A: 因为您的账户 `user_type` 是 `'system'`（系统管理员）。普通用户会跳转到 `dashboard.html`。

### Q: 忘记密码邮件收不到怎么办？
A: 检查后端是否正确配置了邮件服务，确保发送了重置邮件。

### Q: 密码必须8-20位吗？
A: 是的。前端验证8-20位，且必须包含字母和数字。

### Q: 可以修改其他用户的密码吗？
A: 只有系统管理员才能修改其他用户的密码。普通用户只能修改自己的。

### Q: Token过期了怎么办？
A: 页面会自动跳转回登录页，需要重新登录。

## 后端集成检查清单

- [ ] 实现所有 `/api/v1/auth/*` 接口
- [ ] 实现所有 `/api/v1/public/*` 接口
- [ ] 实现所有 `/api/v1/protected/users/*` 接口
- [ ] 配置 CORS 允许前端跨域请求
- [ ] 使用 bcrypt 加密存储密码
- [ ] 实现 JWT Token 生成和验证
- [ ] 验证用户角色权限
- [ ] 配置邮件服务（忘记密码功能）
- [ ] 实施登录尝试限制
- [ ] 添加请求日志记录

## 部署说明

### 开发环境
```bash
# 使用任何Web服务器serve前端文件
# 后端运行在 http://localhost:1234
```

### 生产环境
```bash
# 1. 修改 baseUrl 为实际的后端地址
# auth-system.js, dashboard-app.js, admin-app.js 中

# 2. 启用 HTTPS
# 所有API请求必须使用 HTTPS

# 3. 优化前端资源
# 压缩 HTML/CSS/JS 文件
# 使用 CDN 加速静态资源

# 4. 配置 CORS
# 只允许特定域名跨域请求

# 5. 启用缓存
# 配置合适的 Cache-Control 头
```

## 网络隐私提示

⚠️ **重要**: 虽然前端进行了SHA-256哈希处理，但使用HTTP协议时密码传输仍然**不够安全**。

建议：
- 生产环境必须使用 **HTTPS**
- 不要处理支付或极高敏感度的个人信息
- 定期安全审计
- 使用 HSTS 强制 HTTPS

## 支持

- 📚 完整API文档: 见 `BACKEND_REQUIREMENTS.md`
- 🐛 发现Bug: 检查浏览器控制台错误信息
- 💬 技术支持: 联系开发团队

---

**版本**: 1.0  
**最后更新**: 2024-01-15
