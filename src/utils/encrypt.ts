/**
 * SHA-256 加密工具函数
 * 使用 Web Crypto API 进行安全的密码加密
 */

/**
 * 对字符串进行 SHA-256 加密
 * @param message - 需要加密的字符串
 * @returns 加密后的16进制字符串
 */
export const sha256 = async (message: string): Promise<string> => {
    try {
        // 创建文本编码器，将字符串转换为字节数组
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        
        // 使用 Web Crypto API 进行 SHA-256 加密
        const hash = await crypto.subtle.digest('SHA-256', data);
        
        // 将加密结果转换为16进制字符串
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray
            .map(b => b.toString(16).padStart(2, '0')) // 每个字节转为2位16进制
            .join(''); // 拼接成完整字符串
            
        return hashHex;
    } catch (error) {
        console.error('SHA-256 加密失败:', error);
        throw new Error('密码加密失败，请重试');
    }
};

/**
 * 验证加密功能是否可用
 * @returns 布尔值，表示加密功能是否可用
 */
export const isEncryptionSupported = (): boolean => {
    return !!crypto.subtle && !!crypto.subtle.digest;
};