/**
 * 认证系统核心逻辑
 * 管理用户登录、注册、会话等
 */
class AuthSystem {
    constructor() {
        // 安全地获取后端配置
        const config = this.getBackendConfig();
        this.baseUrl = config.baseUrl;
        this.apiBase = config.apiBase;
        this.token = localStorage.getItem('jwt_token') || '';
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        this.isFormVisible = 'login'; // 'login' 或 'register'
        this.forgotPasswordModal = null;
        this.init();
    }

    /**
     * 安全地获取后端配置
     * 避免在页面中暴露服务器地址
     */
    getBackendConfig() {
        // 优先使用配置文件中的设置
        if (window.getApiConfig) {
            return window.getApiConfig();
        }
        
        // 如果没有配置文件，使用安全的默认配置
        const isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' ||
                            window.location.port === '3000';
        
        if (isDevelopment) {
            // 开发环境：使用完整后端URL解决代理问题
            console.log('🔧 开发环境：使用完整后端URL');
            return {
                baseUrl: 'http://localhost:1234',
                apiBase: '/api/v1'
            };
        } else {
            // 生产环境：使用相对路径，前端和后端部署在同一域名下
            return {
                baseUrl: '',
                apiBase: '/api/v1'
            };
        }
    }

    init() {
        // 如果已登录，重定向到首页
        if (this.token && this.currentUser) {
            this.redirectToDashboard();
            return;
        }

        // 绑定表单事件
        this.bindEvents();
        
        // 初始化模态框
        this.forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'), {
            backdrop: 'static',
            keyboard: false
        });
    }

    bindEvents() {
        // 登录表单
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // 注册表单
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // 实时检查用户名
        const registerUsername = document.getElementById('registerUsername');
        if (registerUsername) {
            registerUsername.addEventListener('input', (e) => this.checkUsername(e.target.value));
        }

        // 实时检查邮箱
        const registerEmail = document.getElementById('registerEmail');
        if (registerEmail) {
            registerEmail.addEventListener('input', (e) => this.checkEmail(e.target.value));
        }

        // 密码强度检查
        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // 确保登录表单在关键事件时获得焦点
        const loginPassword = document.getElementById('loginPassword');
        if (loginPassword) {
            loginPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
                }
            });
        }
    }

    /**
     * 切换登录/注册表单
     */
    toggleForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const formTitle = document.getElementById('formTitle');
        const toggleFormLink = document.getElementById('toggleFormLink');
        const toggleLoginLink = document.getElementById('toggleLoginLink');

        if (this.isFormVisible === 'login') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            formTitle.textContent = '用户注册';
            toggleFormLink.style.display = 'none';
            toggleLoginLink.style.display = 'block';
            this.isFormVisible = 'register';
            this.clearForm('register');
        } else {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formTitle.textContent = '用户登录';
            toggleFormLink.style.display = 'block';
            toggleLoginLink.style.display = 'none';
            this.isFormVisible = 'login';
            this.clearForm('login');
        }
    }

    /**
     * 清空表单
     */
    clearForm(type) {
        if (type === 'login') {
            document.getElementById('loginForm').reset();
            this.hideMessage('error');
            this.hideMessage('success');
        } else if (type === 'register') {
            document.getElementById('registerForm').reset();
            document.getElementById('usernameCheckResult').textContent = '';
            document.getElementById('emailCheckResult').textContent = '';
            document.getElementById('passwordStrengthText').textContent = '密码强度: ';
            document.getElementById('passwordStrengthFill').style.width = '0';
            this.hideMessage('error');
            this.hideMessage('success');
        }
    }

    /**
     * 处理登录
     */
    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            this.showMessage('error', '请输入用户名和密码');
            return;
        }

        try {
            this.setButtonLoading('loginBtnText', true);

            // 前端对密码进行 SHA-256 哈希
            const hashedPassword = await CryptoUtils.hashPassword(password);

            // 调用登录 API
            const response = await this.callApi('/auth/login', 'POST', {
                username: username,
                password: hashedPassword
            });

            if (response.success && response.data?.access_token) {
                // 保存 token 和用户信息
                this.token = response.data.access_token;
                localStorage.setItem('jwt_token', this.token);

                if (response.data.user) {
                    this.currentUser = response.data.user;
                    localStorage.setItem('current_user', JSON.stringify(this.currentUser));
                }

                // 如果勾选"记住我"，保存用户名
                if (rememberMe) {
                    localStorage.setItem('remembered_username', username);
                } else {
                    localStorage.removeItem('remembered_username');
                }

                this.showMessage('success', '登录成功，正在跳转...');
                
                // 根据用户角色跳转
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1000);
            } else {
                this.showMessage('error', response.data?.message || '登录失败，请检查用户名和密码');
            }
        } catch (error) {
            this.showMessage('error', '网络错误，请稍后重试: ' + error.message);
        } finally {
            this.setButtonLoading('loginBtnText', false);
        }
    }

    /**
     * 处理注册
     */
    async handleRegister(e) {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 验证表单
        if (!CryptoUtils.isValidUsername(username)) {
            this.showMessage('error', '用户名格式不正确（3-20位，支持字母、数字、下划线）');
            return;
        }

        if (!CryptoUtils.isValidEmail(email)) {
            this.showMessage('error', '邮箱格式不正确');
            return;
        }

        if (!CryptoUtils.isValidPassword(password)) {
            this.showMessage('error', '密码格式不正确（8-20位，需包含字母和数字）');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('error', '两次输入的密码不一致');
            return;
        }

        if (!document.getElementById('agreeTerms').checked) {
            this.showMessage('error', '请同意用户协议和隐私政策');
            return;
        }

        try {
            this.setButtonLoading('registerBtnText', true);

            // 前端对密码进行 SHA-256 哈希
            const hashedPassword = await CryptoUtils.hashPassword(password);

            // 调用注册 API
            const response = await this.callApi('/auth/register', 'POST', {
                username: username,
                email: email,
                password: hashedPassword,
                user_type: 'app'  // 普通用户注册，默认为 app 类型
            });

            if (response.success) {
                this.showMessage('success', '注册成功！即将跳转至登录页面...');
                
                // 清空注册表单并切换回登录表单
                setTimeout(() => {
                    this.clearForm('register');
                    this.toggleForm();
                    // 预填充用户名
                    document.getElementById('loginUsername').value = username;
                    document.getElementById('loginPassword').focus();
                }, 1500);
            } else {
                this.showMessage('error', response.data?.message || '注册失败，请检查输入信息');
            }
        } catch (error) {
            this.showMessage('error', '网络错误，请稍后重试: ' + error.message);
        } finally {
            this.setButtonLoading('registerBtnText', false);
        }
    }

    /**
     * 检查用户名是否可用
     */
    async checkUsername(username) {
        const resultElement = document.getElementById('usernameCheckResult');
        
        if (!username) {
            resultElement.textContent = '';
            return;
        }

        if (!CryptoUtils.isValidUsername(username)) {
            resultElement.innerHTML = '<span class="text-danger">❌ 用户名格式不正确</span>';
            return;
        }

        try {
            resultElement.textContent = '检查中...';
            const response = await this.callApi('/auth/check-username', 'POST', { 
                username: username 
            });
            
            // 修改：根据后端实际响应格式解析数据
            if (response.success && response.data?.code === 200) {
                if (response.data.data?.available) {
                    resultElement.innerHTML = '<span class="text-success">✓ 用户名可用</span>';
                } else {
                    resultElement.innerHTML = '<span class="text-danger">❌ 用户名已被占用</span>';
                }
            } else {
                resultElement.innerHTML = '<span class="text-danger">❌ 检查失败</span>';
            }
        } catch (error) {
            console.error('检查用户名失败:', error);
            resultElement.innerHTML = '<span class="text-warning">⚠ 检查失败</span>';
        }
    }

    /**
     * 检查邮箱是否可用
     */
    async checkEmail(email) {
        const resultElement = document.getElementById('emailCheckResult');
        
        if (!email) {
            resultElement.textContent = '';
            return;
        }

        if (!CryptoUtils.isValidEmail(email)) {
            resultElement.innerHTML = '<span class="text-danger">❌ 邮箱格式不正确</span>';
            return;
        }

        try {
            resultElement.textContent = '检查中...';
            const response = await this.callApi('/auth/check-email', 'POST', { email });
            
            // 修改：根据后端实际响应格式解析数据
            if (response.success && response.data?.code === 200) {
                if (response.data.data?.available) {
                    resultElement.innerHTML = '<span class="text-success">✓ 邮箱可用</span>';
                } else {
                    resultElement.innerHTML = '<span class="text-danger">❌ 邮箱已被注册</span>';
                }
            } else {
                resultElement.innerHTML = '<span class="text-danger">❌ 检查失败</span>';
            }
        } catch (error) {
            resultElement.innerHTML = '<span class="text-warning">⚠ 检查失败</span>';
        }
    }

    /**
     * 检查密码强度
     */
    checkPasswordStrength(password) {
        const strengthResult = CryptoUtils.checkPasswordStrength(password);
        const textElement = document.getElementById('passwordStrengthText');
        const fillElement = document.getElementById('passwordStrengthFill');

        let color = '#dc3545';  // 红色（弱）
        if (strengthResult.score >= 2) color = '#ffc107';  // 黄色（一般）
        if (strengthResult.score >= 3) color = '#17a2b8';  // 蓝色（中等）
        if (strengthResult.score >= 4) color = '#28a745';  // 绿色（强）

        textElement.innerHTML = `密码强度: <span style="color: ${color}; font-weight: bold;">${strengthResult.message}</span>`;
        fillElement.style.width = strengthResult.percentage + '%';
        fillElement.style.background = color;
    }

    /**
     * 显示忘记密码模态框
     */
    showForgotPasswordModal() {
        this.resetForgotPassword();
        this.forgotPasswordModal.show();
    }

    /**
     * 重置忘记密码表单
     */
    resetForgotPassword() {
        document.getElementById('forgotStep1').style.display = 'block';
        document.getElementById('forgotStep2').style.display = 'none';
        document.getElementById('forgotSuccess').style.display = 'none';
        document.getElementById('resetEmail').value = '';
        document.getElementById('resetCode').value = '';
        document.getElementById('resetNewPassword').value = '';
        document.getElementById('resetConfirmPassword').value = '';
        document.getElementById('forgotSubmitBtn').textContent = '发送重置邮件';
        document.getElementById('forgotSubmitBtn').onclick = () => this.submitForgotPassword();
    }

    /**
     * 提交忘记密码请求
     */
    async submitForgotPassword() {
        const email = document.getElementById('resetEmail').value.trim();
        const currentStep = document.getElementById('forgotStep1').style.display === 'none' ? 2 : 1;

        if (currentStep === 1) {
            // 第一步：请求重置邮件
            if (!CryptoUtils.isValidEmail(email)) {
                this.showMessage('error', '请输入有效的邮箱地址');
                return;
            }

            try {
                const response = await this.callApi('/auth/forgot-password', 'POST', { email });
                
                if (response.success) {
                    // 显示第二步
                    document.getElementById('forgotStep1').style.display = 'none';
                    document.getElementById('forgotStep2').style.display = 'block';
                    document.getElementById('forgotSubmitBtn').textContent = '重置密码';
                    document.getElementById('forgotSubmitBtn').onclick = () => this.submitForgotPassword();
                    this.showMessage('success', '重置邮件已发送，请检查您的邮箱');
                } else {
                    this.showMessage('error', response.data?.message || '请求失败');
                }
            } catch (error) {
                this.showMessage('error', '网络错误: ' + error.message);
            }
        } else {
            // 第二步：提交新密码
            const code = document.getElementById('resetCode').value.trim();
            const newPassword = document.getElementById('resetNewPassword').value;
            const confirmPassword = document.getElementById('resetConfirmPassword').value;

            if (!code) {
                this.showMessage('error', '请输入验证码');
                return;
            }

            if (!CryptoUtils.isValidPassword(newPassword)) {
                this.showMessage('error', '密码格式不正确（8-20位，需包含字母和数字）');
                return;
            }

            if (newPassword !== confirmPassword) {
                this.showMessage('error', '两次输入的密码不一致');
                return;
            }

            try {
                const hashedPassword = await CryptoUtils.hashPassword(newPassword);
                const response = await this.callApi('/auth/reset-password', 'POST', {
                    token: code,
                    new_password: hashedPassword
                });

                if (response.success) {
                    document.getElementById('forgotStep2').style.display = 'none';
                    document.getElementById('forgotSuccess').style.display = 'block';
                    document.getElementById('forgotSubmitBtn').style.display = 'none';
                    
                    setTimeout(() => {
                        this.forgotPasswordModal.hide();
                        this.resetForgotPassword();
                    }, 2000);
                } else {
                    this.showMessage('error', response.data?.message || '重置失败');
                }
            } catch (error) {
                this.showMessage('error', '网络错误: ' + error.message);
            }
        }
    }

    /**
     * 通用 API 调用方法
     */
    async callApi(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${this.apiBase}${endpoint}`;
        console.log(`🔍 API请求: ${method} ${url}`, data);
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            console.log(`📡 API响应: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('📦 API响应数据:', result);
            
            return {
                success: response.ok,
                status: response.status,
                data: result
            };
        } catch (error) {
            console.error('❌ API调用失败:', error);
            throw error;
        }
    }

    /**
     * 显示消息
     */
    showMessage(type, message) {
        const element = document.getElementById(type + 'Message');
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            
            // 自动隐藏成功消息
            if (type === 'success') {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 3000);
            }
        }
    }

    /**
     * 隐藏消息
     */
    hideMessage(type) {
        const element = document.getElementById(type + 'Message');
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * 设置按钮加载状态
     */
    setButtonLoading(elementId, isLoading) {
        const element = document.getElementById(elementId);
        const button = element?.closest('button');
        
        if (button) {
            if (isLoading) {
                element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>处理中...';
                button.disabled = true;
            } else {
                element.textContent = elementId === 'loginBtnText' ? '登录' : '注册';
                button.disabled = false;
            }
        }
    }

    /**
     * 根据用户角色重定向到相应页面
     */
    redirectToDashboard() {
        if (!this.currentUser) {
            return;
        }

        if (this.currentUser.user_type === 'system') {
            // 系统用户跳转到管理后台
            window.location.href = 'admin-dashboard.html';
        } else {
            // 普通用户跳转到数据看板首页
            window.location.href = 'dashboard.html';
        }
    }

    /**
     * 恢复记住的用户名
     */
    loadRememberedUsername() {
        const remembered = localStorage.getItem('remembered_username');
        if (remembered) {
            document.getElementById('loginUsername').value = remembered;
        }
    }
}

// 初始化认证系统
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
    authSystem.loadRememberedUsername();
});





