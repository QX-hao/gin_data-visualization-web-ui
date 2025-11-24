/**
 * 系统管理员后台应用逻辑
 */
class AdminApp {
    constructor() {
        this.baseUrl = '';
        this.apiBase = '/api/v1';
        this.token = localStorage.getItem('jwt_token') || '';
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        // 检查认证
        if (!this.token || !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // 检查用户角色（只有系统用户才能访问）
        if (this.currentUser.user_type !== 'system') {
            window.location.href = 'dashboard.html';
            return;
        }

        this.initializeUI();
        this.bindEvents();
        this.loadDashboardData();
    }

    initializeUI() {
        // 设置管理员头像
        const initial = this.currentUser.username.charAt(0).toUpperCase();
        document.getElementById('adminAvatar').textContent = initial;
    }

    bindEvents() {
        // 侧边栏菜单点击事件已由 onclick 绑定
        // 用户头像点击事件
        document.getElementById('adminAvatar').addEventListener('click', (e) => {
            e.stopPropagation();
            // TODO: 打开管理员菜单
        });
    }

    /**
     * 切换区域
     */
    switchSection(sectionName) {
        // 隐藏所有部分
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // 更新菜单项
        document.querySelectorAll('.sidebar-menu-link').forEach(link => {
            link.classList.remove('active');
        });

        // 显示选中的部分
        const section = document.getElementById(sectionName + 'Section');
        if (section) {
            section.classList.add('active');
        }

        // 更新菜单项样式
        event.currentTarget.classList.add('active');

        this.currentSection = sectionName;

        // 加载对应的数据
        if (sectionName === 'users') {
            this.loadUsers();
        } else if (sectionName === 'dashboards') {
            this.loadDashboards();
        } else if (sectionName === 'datasources') {
            this.loadDataSources();
        } else if (sectionName === 'logs') {
            this.loadLogs();
        }
    }

    /**
     * 加载仪表板数据
     */
    async loadDashboardData() {
        try {
            // 这里应该调用实际的 API 来获取统计数据
            // 暂时使用模拟数据
            document.getElementById('totalUsers').textContent = '152';
            document.getElementById('totalDashboards').textContent = '28';
            document.getElementById('totalDataSources').textContent = '12';
            document.getElementById('totalRequests').textContent = '3,421';
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    /**
     * 加载用户列表
     */
    async loadUsers() {
        try {
            const response = await this.callApi('/protected/users', 'GET');
            const tableBody = document.getElementById('usersTable');

            if (response.success && response.data?.data) {
                const users = response.data.data;
                
                let html = '';
                users.forEach(user => {
                    const userType = user.user_type === 'system' ? '系统用户' : '普通用户';
                    const statusBadge = user.status === 'active' 
                        ? '<span class="badge-admin badge-success">活跃</span>' 
                        : '<span class="badge-admin badge-danger">停用</span>';
                    
                    html += `
                        <tr>
                            <td>#${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${userType}</td>
                            <td>${statusBadge}</td>
                            <td>${new Date(user.created_at).toLocaleDateString('zh-CN')}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" onclick="adminApp.editUser(${user.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="adminApp.deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                tableBody.innerHTML = html || '<tr><td colspan="7" class="text-center text-muted py-4">暂无用户</td></tr>';
            } else {
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">加载失败</td></tr>';
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }

    /**
     * 创建用户
     */
    createUser() {
        const username = prompt('输入用户名:');
        if (!username) return;

        const email = prompt('输入邮箱:');
        if (!email) return;

        const password = prompt('输入初始密码 (8-20位，需包含字母和数字):');
        if (!password) return;

        if (!CryptoUtils.isValidPassword(password)) {
            alert('密码格式不正确');
            return;
        }

        this.submitCreateUser(username, email, password);
    }

    /**
     * 提交创建用户
     */
    async submitCreateUser(username, email, password) {
        try {
            const hashedPassword = await CryptoUtils.hashPassword(password);
            const response = await this.callApi('/auth/register', 'POST', {
                username: username,
                email: email,
                password: hashedPassword,
                user_type: 'app'
            });

            if (response.success) {
                alert('用户创建成功！');
                this.loadUsers();
            } else {
                alert(response.data?.message || '创建失败');
            }
        } catch (error) {
            alert('错误: ' + error.message);
        }
    }

    /**
     * 编辑用户
     */
    editUser(userId) {
        alert('此功能将打开用户编辑窗口 (ID: ' + userId + ')');
    }

    /**
     * 删除用户
     */
    deleteUser(userId) {
        if (!confirm('确定要删除此用户吗？')) {
            return;
        }

        alert('此功能将删除用户 (ID: ' + userId + ')');
    }

    /**
     * 导入用户
     */
    importUsers() {
        alert('此功能将打开用户批量导入窗口');
    }

    /**
     * 导出用户
     */
    exportUsers() {
        alert('此功能将导出用户数据为 CSV 文件');
    }

    /**
     * 加载看板列表
     */
    async loadDashboards() {
        // TODO: 实现看板列表加载
    }

    /**
     * 创建看板
     */
    createDashboard() {
        alert('此功能将打开看板创建编辑器');
    }

    /**
     * 加载数据源列表
     */
    async loadDataSources() {
        // TODO: 实现数据源列表加载
    }

    /**
     * 添加数据源
     */
    addDataSource() {
        alert('此功能将打开数据源配置窗口');
    }

    /**
     * 加载访问日志
     */
    async loadLogs() {
        // TODO: 实现日志列表加载
    }

    /**
     * 打开设置
     */
    openSettings() {
        alert('此功能将打开系统设置面板');
    }

    /**
     * 登出
     */
    async logout() {
        if (!confirm('确定要登出吗？')) {
            return;
        }

        try {
            await this.callApi('/auth/logout', 'POST');
        } catch (error) {
            console.error('Logout API error:', error);
        }

        // 清除本地数据
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('current_user');
        
        // 跳转到登录页
        window.location.href = 'login.html';
    }

    /**
     * 通用 API 调用
     */
    async callApi(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${this.apiBase}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            return {
                success: response.ok,
                status: response.status,
                data: result
            };
        } catch (error) {
            throw error;
        }
    }
}

// 初始化应用
let adminApp;
document.addEventListener('DOMContentLoaded', () => {
    adminApp = new AdminApp();
});
