/**
 * 普通用户仪表板应用逻辑
 */
class DashboardApp {
    constructor() {
        this.baseUrl = '';
        this.apiBase = '/api/v1';
        this.token = localStorage.getItem('jwt_token') || '';
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        this.accountModal = null;
        this.init();
    }

    init() {
        // 检查认证
        if (!this.token || !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // 检查用户角色（普通用户才能访问此页面）
        if (this.currentUser.user_type !== 'app') {
            window.location.href = 'admin-dashboard.html';
            return;
        }

        this.initializeUI();
        this.bindEvents();
        this.accountModal = new bootstrap.Modal(document.getElementById('accountModal'));
    }

    initializeUI() {
        // 显示欢迎信息
        const greeting = `欢迎回来，${this.currentUser.username}！`;
        document.getElementById('userGreeting').textContent = greeting;
        document.getElementById('welcomeGreeting').innerHTML = `
            <i class="fas fa-hand-wave" style="color: #667eea; margin-right: 10px;"></i>
            ${greeting}
        `;
        document.getElementById('welcomeMessage').textContent = '这是您的个人数据看板首页。您可以创建新的可视化分析、管理现有的看板，或导入新数据。';

        // 获取用户头像首字母
        const initial = this.currentUser.username.charAt(0).toUpperCase();
        document.getElementById('userAvatarBtn').textContent = initial;
    }

    bindEvents() {
        // 用户菜单
        document.getElementById('userAvatarBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = document.getElementById('userDropdownMenu');
            menu.classList.toggle('show');
        });

        // 点击页面其他地方时关闭菜单
        document.addEventListener('click', () => {
            const menu = document.getElementById('userDropdownMenu');
            menu.classList.remove('show');
        });
    }

    /**
     * 打开账户设置
     */
    openAccountSettings() {
        document.getElementById('profileUsername').value = this.currentUser.username;
        document.getElementById('profileEmail').value = this.currentUser.email || '';
        document.getElementById('profileUserType').value = '普通用户';
        this.accountModal.show();
    }

    /**
     * 更新用户资料
     */
    async updateProfile() {
        const newEmail = document.getElementById('profileEmail').value.trim();

        if (!CryptoUtils.isValidEmail(newEmail)) {
            alert('邮箱格式不正确');
            return;
        }

        try {
            const response = await this.callApi('/protected/users/profile', 'PUT', {
                email: newEmail
            });

            if (response.success) {
                this.currentUser.email = newEmail;
                localStorage.setItem('current_user', JSON.stringify(this.currentUser));
                alert('资料已更新');
                this.accountModal.hide();
            } else {
                alert(response.data?.message || '更新失败');
            }
        } catch (error) {
            alert('网络错误: ' + error.message);
        }
    }

    /**
     * 修改密码
     */
    changePassword() {
        this.accountModal.show();
        // 自动切换到安全设置标签
        const securityTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#security"]'));
        securityTab.show();
    }

    /**
     * 提交密码修改
     */
    async submitChangePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('请填写所有密码字段');
            return;
        }

        if (!CryptoUtils.isValidPassword(newPassword)) {
            alert('新密码格式不正确（8-20位，需包含字母和数字）');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('两次密码输入不一致');
            return;
        }

        try {
            // 对密码进行 SHA-256 哈希
            const hashedCurrentPassword = await CryptoUtils.hashPassword(currentPassword);
            const hashedNewPassword = await CryptoUtils.hashPassword(newPassword);

            const response = await this.callApi('/protected/users/password', 'PUT', {
                old_password: hashedCurrentPassword,
                new_password: hashedNewPassword
            });

            if (response.success) {
                alert('密码已更新成功');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                this.accountModal.hide();
            } else {
                alert(response.data?.message || '密码修改失败');
            }
        } catch (error) {
            alert('网络错误: ' + error.message);
        }
    }

    /**
     * 创建新仪表板
     */
    createDashboard() {
        alert('此功能将跳转到仪表板创建编辑器');
        // TODO: 跳转到仪表板编辑页面
    }

    /**
     * 查看我的看板
     */
    viewMyDashboards() {
        alert('此功能将显示您的所有看板');
        // TODO: 跳转到看板列表页面
    }

    /**
     * 前往数据分析
     */
    goToAnalytics() {
        alert('此功能将跳转到数据分析页面');
        // TODO: 跳转到分析页面
    }

    /**
     * 导入数据
     */
    importData() {
        alert('此功能将打开数据导入向导');
        // TODO: 打开数据导入模态框
    }

    /**
     * 查看通知
     */
    viewNotifications() {
        alert('您没有新通知');
    }

    /**
     * 获取帮助
     */
    getHelp() {
        window.open('https://help.example.com', '_blank');
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
let dashboardApp;
document.addEventListener('DOMContentLoaded', () => {
    dashboardApp = new DashboardApp();
});
