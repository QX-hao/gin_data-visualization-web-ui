/**
 * 加密工具库
 * 使用 SHA-256 对密码进行哈希处理
 */

// 将 CryptoUtils 导出为默认模块
// export default CryptoUtils;
export class CryptoUtils {
    /**
     * SHA-256 哈希函数
     * @param {string} message - 要哈希的消息
     * @returns {Promise<string>} - 返回哈希值（十六进制）
     */
    static async sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    /**
     * 对密码进行哈希处理
     * @param {string} password - 原始密码
     * @returns {Promise<string>} - 返回哈希后的密码
     */
    static async hashPassword(password) {
        return await this.sha256(password);
    }

    /**
     * 验证密码强度
     * @param {string} password - 密码
     * @returns {object} - {score: 0-4, message: 强度描述}
     */
    static checkPasswordStrength(password) {
        let score = 0;
        let message = '弱';

        if (!password) {
            return { score: 0, message: '请输入密码' };
        }

        // 检查长度
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // 检查字符类型
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        // 根据得分设置消息
        if (score <= 1) message = '弱';
        else if (score <= 2) message = '一般';
        else if (score <= 3) message = '中等';
        else if (score <= 4) message = '强';
        else message = '非常强';

        return { 
            score: Math.min(score, 4), 
            message: message,
            percentage: (Math.min(score, 4) / 4) * 100
        };
    }

    /**
     * 验证密码格式（8-20位，包含字母和数字）
     * @param {string} password - 密码
     * @returns {boolean}
     */
    static isValidPassword(password) {
        if (!password || password.length < 8 || password.length > 20) {
            return false;
        }
        return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
    }

    /**
     * 验证用户名格式
     * @param {string} username - 用户名
     * @returns {boolean}
     */
    static isValidUsername(username) {
        if (!username || username.length < 3 || username.length > 20) {
            return false;
        }
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username);
    }

    /**
     * 验证邮箱格式
     * @param {string} email - 邮箱
     * @returns {boolean}
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}


