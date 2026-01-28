import request from '../utils/request';

export * from './user';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

// 获取能源分布数据
export const fetchEnergyDistribution = () => {
    return request({
        url: '/api/v1/public/energy/distribution',
        method: 'get'
    });
};

// 获取城市销售数据
export const fetchCitySales = () => {
    return request({
        url: '/api/v1/public/city/sales',
        method: 'get'
    });
};

// 获取Top 20品牌销售数据
export const fetchTopBrandSales = () => {
    return request({
        url: '/api/v1/public/brand/top-sales',
        method: 'get'
    });
};

// 获取Last 20品牌销售数据
export const fetchLastBrandSales = () => {
    return request({
        url: '/api/v1/public/brand/last-sales',
        method: 'get'
    });
};