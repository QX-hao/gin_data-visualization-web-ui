/**
 * 前端配置文件
 * 安全地管理后端服务器地址
 * 在生产环境中，此文件应通过构建工具注入环境变量
 */

// 后端API配置
window.APP_CONFIG = {
    // API基础路径
    API_BASE_URL: process.env.API_BASE_URL || '/api/v1',
    
    // 开发环境配置
    DEVELOPMENT: {
        // 开发环境后端地址（仅在开发时使用）
        BACKEND_URL: process.env.DEV_BACKEND_URL || 'http://localhost:1234',
        // 是否启用开发模式
        ENABLED: process.env.NODE_ENV === 'development'
    },
    
    // 生产环境配置
    PRODUCTION: {
        // 生产环境使用相对路径
        BACKEND_URL: '',
        // 生产环境标识
        ENABLED: process.env.NODE_ENV === 'production'
    }
};

// 获取当前环境的配置
window.getApiConfig = function() {
    const config = window.APP_CONFIG;
    
    if (config.DEVELOPMENT.ENABLED) {
        return {
            baseUrl: config.DEVELOPMENT.BACKEND_URL,
            apiBase: config.API_BASE_URL
        };
    } else {
        return {
            baseUrl: config.PRODUCTION.BACKEND_URL,
            apiBase: config.API_BASE_URL
        };
    }
};