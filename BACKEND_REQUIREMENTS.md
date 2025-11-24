# DataViz Pro 数据可视化平台 - 后端接口要求文档

## 概述

本文档详细列出了前端所需的所有后端API接口规范。前端使用SHA-256对密码进行哈希处理后发送给后端，后端再使用bcrypt进行加密存储。

---

## 1. 认证接口 (`/api/v1/auth/`)

### 1.1 用户注册
**端点**: `POST /api/v1/auth/register`

**请求体**:
```json
{
  "username": "string (3-20字符)",
  "email": "string (有效邮箱)",
  "password": "string (SHA-256哈希值)",
  "user_type": "app|system (可选，默认为'app')"
}
```

**成功响应** (HTTP 201):
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "app",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "用户名已存在" / "邮箱已被注册" / "请求参数错误",
  "error": "详细错误信息"
}
```

---

### 1.2 用户登录
**端点**: `POST /api/v1/auth/login`

**请求体**:
```json
{
  "username": "string (用户名或邮箱)",
  "password": "string (SHA-256哈希值)"
}
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "optional_refresh_token",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "user_type": "app|system",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

**错误响应**:
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "error": "Authentication failed"
}
```

---

### 1.3 用户登出
**端点**: `POST /api/v1/auth/logout`

**认证要求**: 需要 `Authorization: Bearer <access_token>` 请求头

**请求体**: 无

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "登出成功",
  "data": {}
}
```

---

### 1.4 刷新令牌
**端点**: `POST /api/v1/auth/refresh`

**认证要求**: 需要 `Authorization: Bearer <access_token>` 请求头

**请求体**: 无

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "令牌刷新成功",
  "data": {
    "access_token": "新的JWT令牌"
  }
}
```

---

### 1.5 忘记密码
**端点**: `POST /api/v1/auth/forgot-password`

**请求体**:
```json
{
  "email": "user@example.com"
}
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "重置邮件已发送，请检查您的邮箱",
  "data": {}
}
```

**说明**: 
- 后端应生成一个唯一的重置令牌
- 将重置链接发送到用户邮箱（包含令牌）
- 令牌有效期为24小时

---

### 1.6 重置密码
**端点**: `POST /api/v1/auth/reset-password`

**请求体**:
```json
{
  "token": "重置令牌",
  "new_password": "string (SHA-256哈希值)"
}
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": {}
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "重置令牌已过期或无效",
  "error": "Invalid or expired token"
}
```

---

### 1.7 检查用户名可用性
**端点**: `POST /api/v1/auth/check-username`

**请求体**:
```json
{
  "username": "string"
}
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "available": true  // false 表示用户名已被占用
  }
}
```

---

### 1.8 检查邮箱可用性
**端点**: `POST /api/v1/auth/check-email`

**请求体**:
```json
{
  "email": "string"
}
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "available": true  // false 表示邮箱已被注册
  }
}
```

---

## 2. 公开接口 (`/api/v1/public/`)

### 2.1 健康检查
**端点**: `GET /api/v1/public/health`

**认证要求**: 无

**成功响应** (HTTP 200):
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 3. 受保护的用户接口 (`/api/v1/protected/users/`)

### 3.1 获取用户资料
**端点**: `GET /api/v1/protected/users/profile`

**认证要求**: 需要 `Authorization: Bearer <access_token>` 请求头

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "app",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3.2 更新用户资料
**端点**: `PUT /api/v1/protected/users/profile`

**认证要求**: 需要 `Authorization: Bearer <access_token>` 请求头

**请求体** (所有字段可选):
```json
{
  "username": "string (可选)",
  "email": "string (可选)"
}
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "new_username",
    "email": "new_email@example.com",
    "user_type": "app",
    "status": "active",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3.3 修改密码
**端点**: `PUT /api/v1/protected/users/password`

**认证要求**: 需要 `Authorization: Bearer <access_token>` 请求头

**请求体**:
```json
{
  "old_password": "string (SHA-256哈希值)",
  "new_password": "string (SHA-256哈希值)",
  "target_username": "string (可选，仅系统管理员)"
}
```

**说明**:
- 普通用户修改自己的密码时，需要提供 `old_password` 和 `new_password`
- 系统管理员可以修改其他用户的密码，此时提供 `target_username` 和 `new_password`（不需要原密码）
- 后端需要验证 `old_password` 是否与数据库中存储的bcrypt哈希匹配

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": {}
}
```

**错误响应**:
```json
{
  "code": 401,
  "message": "原密码错误",
  "error": "Old password is incorrect"
}
```

---

### 3.4 获取用户列表（仅管理员）
**端点**: `GET /api/v1/protected/users`

**认证要求**: 需要 `Authorization: Bearer <access_token>` 请求头

**权限要求**: 用户必须是 `user_type` 为 `'system'` 的管理员

**查询参数** (可选):
```
?page=1&limit=20&search=username&sort=created_at
```

**成功响应** (HTTP 200):
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "user_type": "app",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "username": "admin_user",
      "email": "admin@example.com",
      "user_type": "system",
      "status": "active",
      "created_at": "2024-01-10T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

## 4. 统一错误响应格式

所有失败的API响应都应遵循以下格式：

```json
{
  "code": 400|401|403|404|500,
  "message": "用户友好的错误信息",
  "error": "详细的技术错误信息（可选）"
}
```

**常见错误码**:
- `400`: 请求参数错误
- `401`: 未授权/认证失败
- `403`: 禁止访问（权限不足）
- `404`: 资源不存在
- `409`: 资源冲突（如用户名已存在）
- `500`: 服务器内部错误

---

## 5. 认证机制

### JWT Token 结构
前端将 `access_token` 保存在 `localStorage` 中，在后续请求的请求头中如下传递：

```
Authorization: Bearer <access_token>
```

### Token 验证
后端需要：
1. 验证 JWT 签名
2. 检查 Token 是否过期
3. 从 Token 中提取用户信息

### 密码处理流程

```
用户输入密码
↓
前端使用 SHA-256 哈希处理
↓
发送哈希值给后端
↓
后端使用 bcrypt 再次加密存储
↓
登录时，后端用 bcrypt 对比
```

**示例代码（伪代码）**:

```
登录：
  前端: password_hash = SHA256(user_input_password)
  后端: if bcrypt_compare(password_hash, stored_bcrypt_hash): login_success

修改密码：
  前端: old_password_hash = SHA256(user_input_old_password)
        new_password_hash = SHA256(user_input_new_password)
  后端: if bcrypt_compare(old_password_hash, stored_bcrypt_hash):
          new_stored_hash = bcrypt_hash(new_password_hash)
          update database
```

---

## 6. 特殊业务规则

### 用户类型说明
- `app`: 普通用户，可以查看和使用数据看板
- `system`: 系统管理员，可以管理用户、看板、数据源等

### 用户状态说明
- `active`: 用户账户已激活，可以正常使用
- `inactive`: 用户账户未激活，禁止登录

### 首次登录强制修改密码（可选）
如果用户是由管理员创建的，可以在首次登录时强制修改初始密码：

**响应示例**:
```json
{
  "code": 200,
  "message": "首次登录，请修改密码",
  "data": {
    "access_token": "...",
    "user": {...},
    "force_change_password": true
  }
}
```

---

## 7. 前端框架说明

前端使用以下文件组织：

| 文件 | 说明 |
|------|------|
| `login.html` | 登录/注册页面 |
| `dashboard.html` | 普通用户首页 |
| `admin-dashboard.html` | 系统管理员后台 |
| `static/js/crypto-utils.js` | 加密工具库（SHA-256） |
| `static/js/auth-system.js` | 认证系统核心逻辑 |
| `static/js/dashboard-app.js` | 普通用户应用逻辑 |
| `static/js/admin-app.js` | 管理员应用逻辑 |

---

## 8. 跨域配置

后端需要配置CORS（跨域资源共享），允许来自前端的请求：

```
允许的源: http://localhost:3000 (开发环境)
允许的方法: GET, POST, PUT, DELETE, OPTIONS
允许的请求头: Content-Type, Authorization
```

---

## 9. 实现建议

1. **密码存储**: 使用bcrypt加密库，不要存储明文密码
2. **Token生成**: 使用标准的JWT库生成token，设置合理的过期时间（如24小时）
3. **输入验证**: 验证所有输入参数的格式和长度
4. **错误处理**: 返回明确的错误信息和HTTP状态码
5. **日志记录**: 记录登录、登出、密码修改等重要操作
6. **速率限制**: 实施登录尝试限制（如5次失败后锁定10分钟）
7. **HTTPS**: 生产环境必须使用HTTPS，HTTP+SHA256仍不够安全

---

**文档版本**: 1.0  
**最后更新**: 2024-01-15  
**维护者**: Development Team
