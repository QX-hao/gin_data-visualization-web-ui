<template>
    <div>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg1">
                        <User />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color1" :end="6666" />
                        <div>用户访问量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg2">
                        <ChatDotRound />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color2" :end="168" />
                        <div>系统消息</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg3">
                        <Goods />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color3" :end="8888" />
                        <div>商品数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg4">
                        <ShoppingCartFull />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color4" :end="568" />
                        <div>今日订单量</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mgb20">
            <el-col :span="18">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">品牌销售对比</p>
                        <p class="card-header-desc">Top 20品牌与Last 20品牌销售数据对比分析</p>
                    </div>
                    <div v-loading="brandLoading" element-loading-text="加载中...">
                        <v-chart v-if="!brandLoading" class="chart" :option="brandSalesComparisonOptions" @legendselectchanged="handleLegendSelect" />
                        <div v-else class="loading-placeholder">
                            <el-empty description="数据加载中" />
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">能源类型分布</p>
                        <p class="card-header-desc">各种能源类型的车辆数量统计</p>
                    </div>
                    <div v-loading="energyLoading" element-loading-text="加载中...">
                        <v-chart class="chart" :option="energyDistributionOptions" v-if="!energyLoading" />
                        <div v-else class="loading-placeholder">
                            <el-empty description="数据加载中" />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">时间线</p>
                        <p class="card-header-desc">最新的销售动态和活动信息</p>
                    </div>
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color">
                            <div class="timeline-item">
                                <div>
                                    <p>{{ activity.content }}</p>
                                    <p class="timeline-desc">{{ activity.description }}</p>
                                </div>
                                <div class="timeline-time">{{ activity.timestamp }}</div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">城市销售分布</p>
                        <p class="card-header-desc">各地级市销售数据统计</p>
                    </div>
                    <div v-loading="cityLoading" element-loading-text="加载中...">
                        <v-chart v-if="!cityLoading" class="map-chart" :option="citySalesOptions" @zr:click="handleMapClick" @globalout="handleMapGlobalOut" @datazoom="handleMapZoom" />
                        <el-empty v-else-if="Object.keys(citySalesOptions).length === 0" description="暂无数据" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">排行榜</p>
                        <p class="card-header-desc">销售商品的热门榜单Top5</p>
                    </div>
                    <div>
                        <div class="rank-item" v-for="(rank, index) in ranks">
                            <div class="rank-item-avatar">{{ index + 1 }}</div>
                            <div class="rank-item-content">
                                <div class="rank-item-top">
                                    <div class="rank-item-title">{{ rank.title }}</div>
                                    <div class="rank-item-desc">销量：{{ rank.value }}</div>
                                </div>
                                <el-progress
                                    :show-text="false"
                                    striped
                                    :stroke-width="10"
                                    :percentage="rank.percent"
                                    :color="rank.color"
                                />
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts" name="dashboard">
import countup from '@/components/countup.vue';
import { use, registerMap } from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { ref, onMounted } from 'vue';
import { dashOpt1, dashOpt2, mapOptions, getEnergyDistributionOptions, getCitySalesOptions, getBrandSalesComparisonOptions } from './chart/options';
import { fetchEnergyDistribution, fetchCitySales, fetchTopBrandSales, fetchLastBrandSales } from '@/api';
// 导入本地地级市地图数据
import chinaGeoJSON from '../utils/chinaCitys.geojson?raw';

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    LineChart,
    PieChart,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
    MapChart,
]);

// 使用本地地级市地图数据
const mapData = ref(null);

// 加载地图数据
const loadMapData = () => {
    try {
        // 解析GeoJSON字符串为对象
        const geoJSONData = JSON.parse(chinaGeoJSON);
        // 使用本地地级市GeoJSON数据注册地图
        registerMap('china', geoJSONData);
        registerMap('chinaCity', geoJSONData); // 统一使用相同的地图数据
        mapData.value = geoJSONData;
        // console.log('地级市地图数据加载成功');
    } catch (error) {
        console.error('加载地级市地图数据失败:', error);
    }
};

// 响应式数据
const energyLoading = ref(true);
const energyDistributionOptions = ref({});
const cityLoading = ref(true);
const citySalesOptions = ref({});
const brandLoading = ref(true);
const brandSalesComparisonOptions = ref({});

// 获取能源分布数据
const loadEnergyDistribution = async () => {
    try {
        energyLoading.value = true;
        const response = await fetchEnergyDistribution();
        
        // 检查响应状态码
        if (response.status >= 200 && response.status < 300) {
            // 使用后端返回的数据生成图表配置
            // 注意：response.data 是后端返回的完整响应对象，包含 code、message、data 字段
            energyDistributionOptions.value = getEnergyDistributionOptions(response.data.data);
        } else {
            console.error('获取能源分布数据失败，状态码:', response.status);
            // 可以设置一个默认的图表配置或错误提示
        }
    } catch (error) {
        console.error('获取能源分布数据时发生错误:', error);
        // 可以设置一个默认的图表配置或错误提示
    } finally {
        energyLoading.value = false;
    }
};

// 获取城市销售数据
const loadCitySales = async () => {
    try {
        cityLoading.value = true;
        const response = await fetchCitySales();
        
        // 检查响应状态码
        if (response.status >= 200 && response.status < 300) {
            // 使用后端返回的城市销售数据生成地图配置
            // 注意：response.data.data 是城市销售数据数组
            citySalesOptions.value = getCitySalesOptions(response.data.data);
        } else {
            console.error('获取城市销售数据失败，状态码:', response.status);
            // 可以设置一个默认的图表配置或错误提示
        }
    } catch (error) {
        console.error('获取城市销售数据时发生错误:', error);
        // 可以设置一个默认的图表配置或错误提示
    } finally {
        cityLoading.value = false;
    }
};

// 存储原始品牌数据用于动态切换
let topBrandsData: { brand_name: string; total_sales: number }[] = [];
let lastBrandsData: { brand_name: string; total_sales: number }[] = [];

// 获取品牌销售对比数据
const loadBrandSalesComparison = async () => {
    try {
        brandLoading.value = true;
        
        // 同时获取Top 20和Last 20品牌数据
        const [topResponse, lastResponse] = await Promise.all([
            fetchTopBrandSales(),
            fetchLastBrandSales()
        ]);
        
        // 检查两个API的响应状态码
        if (topResponse.status >= 200 && topResponse.status < 300 && 
            lastResponse.status >= 200 && lastResponse.status < 300) {
            
            // 存储原始数据
            topBrandsData = topResponse.data.data;
            lastBrandsData = lastResponse.data.data;
            
            // 使用后端返回的品牌数据生成对比图表配置
            const originalOptions = getBrandSalesComparisonOptions(
                topBrandsData,
                lastBrandsData
            );
            
            // 添加图例点击事件处理
            originalOptions.legend = {
                ...originalOptions.legend
            };
            
            brandSalesComparisonOptions.value = originalOptions;
        } else {
            console.error('获取品牌销售数据失败，Top API状态码:', topResponse.status, 'Last API状态码:', lastResponse.status);
            // 可以设置一个默认的图表配置或错误提示
        }
    } catch (error) {
        console.error('获取品牌销售数据时发生错误:', error);
        // 可以设置一个默认的图表配置或错误提示
    } finally {
        brandLoading.value = false;
    }
};

// 处理图例点击事件，动态切换品牌名称
const handleLegendSelect = (params: any) => {
    if (params.name === 'Top 20品牌') {
        // 切换到Top 20品牌
        const newOptions = getBrandSalesComparisonOptions(topBrandsData, lastBrandsData);
        // 更新y轴品牌名称为Top 20品牌
        newOptions.yAxis.data = topBrandsData.map(item => item.brand_name);
        // 只显示Top 20品牌的数据，隐藏Last 20品牌的数据
        newOptions.series[0].data = topBrandsData.map(item => item.total_sales);
        newOptions.series[1].data = []; // 清空Last 20数据，不显示
        brandSalesComparisonOptions.value = newOptions;
    } else if (params.name === 'Last 20品牌') {
        // 切换到Last 20品牌
        const newOptions = getBrandSalesComparisonOptions(topBrandsData, lastBrandsData);
        // 更新y轴品牌名称为Last 20品牌
        newOptions.yAxis.data = lastBrandsData.map(item => item.brand_name);
        // 只显示Last 20品牌的数据，隐藏Top 20品牌的数据
        newOptions.series[0].data = []; // 清空Top 20数据，不显示
        newOptions.series[1].data = lastBrandsData.map(item => item.total_sales);
        brandSalesComparisonOptions.value = newOptions;
    }
};

// 处理地图点击事件（用于缩放检测）
const handleMapClick = (params: any) => {
    // 简单的缩放检测，不需要复杂的DOM操作
    console.log('地图被点击或缩放');
};

// 处理鼠标移出地图事件
const handleMapGlobalOut = (params: any) => {
    // 简单的鼠标移出处理
    // console.log('鼠标移出地图');
};

// 处理地图缩放事件
const handleMapZoom = (params: any) => {
    // 简单的缩放事件处理，使用ECharts内置的标签控制
    console.log('地图缩放事件触发，缩放级别:', params.zoom);
    // 标签显示由ECharts内置的labelLayout智能控制，无需额外处理
};

// 组件挂载时加载地图和数据
onMounted(() => {
    loadMapData();
    loadEnergyDistribution();
    loadCitySales();
    loadBrandSalesComparison();
});
const activities = [
    {
        content: '收藏商品',
        description: 'xxx收藏了你的商品，就是不买',
        timestamp: '30分钟前',
        color: '#00bcd4',
    },
    {
        content: '用户评价',
        description: 'xxx给了某某商品一个差评，吐血啊',
        timestamp: '55分钟前',
        color: '#1ABC9C',
    },
    {
        content: '订单提交',
        description: 'xxx提交了订单，快去收钱吧',
        timestamp: '1小时前',
        color: '#3f51b5',
    },
    {
        content: '退款申请',
        description: 'xxx申请了仅退款，又要亏钱了',
        timestamp: '15小时前',
        color: '#f44336',
    },
    {
        content: '商品上架',
        description: '运营专员瞒着你上架了一辆飞机',
        timestamp: '1天前',
        color: '#009688',
    },
];

const ranks = [
    {
        title: '手机',
        value: 10000,
        percent: 80,
        color: '#f25e43',
    },
    {
        title: '电脑',
        value: 8000,
        percent: 70,
        color: '#00bcd4',
    },
    {
        title: '相机',
        value: 6000,
        percent: 60,
        color: '#64d572',
    },
    {
        title: '衣服',
        value: 5000,
        percent: 55,
        color: '#e9a745',
    },
    {
        title: '书籍',
        value: 4000,
        percent: 50,
        color: '#009688',
    },
];
</script>

<style>
.card-body {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0;
}
</style>
<style scoped>
.card-content {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
    padding: 0 20px;
}

.card-num {
    font-size: 30px;
}

.card-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.bg1 {
    background: #2d8cf0;
}

.bg2 {
    background: #64d572;
}

.bg3 {
    background: #f25e43;
}

.bg4 {
    background: #e9a745;
}

.color1 {
    color: #2d8cf0;
}

.color2 {
    color: #64d572;
}

.color3 {
    color: #f25e43;
}

.color4 {
    color: #e9a745;
}

.chart {
    width: 100%;
    height: 400px;
}

.card-header {
    padding-left: 10px;
    margin-bottom: 20px;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-header-desc {
    font-size: 14px;
    color: #999;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #000;
}

.timeline-time,
.timeline-desc {
    font-size: 12px;
    color: #787878;
}

.rank-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.rank-item-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f2f2f2;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
}

.rank-item-content {
    flex: 1;
}

.rank-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #343434;
    margin-bottom: 10px;
}

.rank-item-desc {
    font-size: 14px;
    color: #999;
}
.map-chart {
    width: 100%;
    height: 500px;
    min-height: 500px;
}
</style>