import request from '../utils/request';
import type { Register } from '@/types/user';

/**
 * 用户注册API
 * @param params 注册参数
 * @returns 注册结果
 */
export const registerApi = (params: Register): Promise<any> => {
    return request({
        url: '/api/v1/auth/register',
        method: 'post',
        data: params
    });
};

/**
 * 用户登录API
 * @param params 登录参数
 * @returns 登录结果
 */
export const loginApi = (params: { username: string; password: string }): Promise<any> => {
    return request({
        url: '/api/user/login',
        method: 'post',
        data: params
    });
};

/**
 * 获取用户信息API
 * @returns 用户信息
 */
export const getUserInfoApi = (): Promise<any> => {
    return request({
        url: '/api/user/info',
        method: 'get'
    });
};

/**
 * 验证用户名API
 * 检查用户名是否可用
 * @param params 用户名参数
 * @returns 用户名验证结果
 */
export const checkUsernameApi = (params: { username: string }): Promise<any> => {
    return request({
        url: '/api/v1/auth/check-username',
        method: 'post',
        data: params
    });
};

/**
 * 验证邮箱名API
 * 检查邮箱是否可用
 * @param params 邮箱参数
 * @returns 邮箱验证结果
 */
export const checkEmailApi = (params: { email: string }): Promise<any> => {
    return request({
        url: '/api/v1/auth/check-email',
        method: 'post',
        data: params
    });
};
