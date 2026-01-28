import { graphic } from 'echarts/core';
export const barOptions = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    color: ['#009688', '#f44336'],
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
        },
        {
            data: [180, 230, 190, 120, 110, 230, 235],
            type: 'bar',
        },
    ],
};

// 生成品牌销售对比图表配置（Top 20 vs Last 20）
export const getBrandSalesComparisonOptions = (topBrandData: { brand_name: string; total_sales: number }[], lastBrandData: { brand_name: string; total_sales: number }[]) => {
    // 处理Top 20品牌数据
    const topBrands = topBrandData.map(item => ({
        name: item.brand_name,
        value: item.total_sales
    }));
    
    // 处理Last 20品牌数据
    const lastBrands = lastBrandData.map(item => ({
        name: item.brand_name,
        value: item.total_sales
    }));

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params: any) {
                let result = params[0].name + '<br/>';
                params.forEach((item: any) => {
                    if (item.value !== undefined) {
                        result += item.marker + item.seriesName + ': ' + item.value + '<br/>';
                    }
                });
                return result;
            }
        },
        legend: {
            data: ['Top 20品牌', 'Last 20品牌'],
            top: '1%',
            textStyle: {
                color: '#333'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'category',
            data: topBrands.map(item => item.name),
            axisLabel: {
                color: '#666',
                formatter: function(value: string) {
                    // 品牌名称过长时截断显示
                    return value.length > 6 ? value.substring(0, 6) + '...' : value;
                }
            }
        },
        color: ['#009688', '#f44336'],
        series: [
            {
                name: 'Top 20品牌',
                type: 'bar',
                data: topBrands.map(item => item.value),
                itemStyle: {
                    color: new graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#009688' },
                        { offset: 1, color: '#4DB6AC' }
                    ])
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
                }
            },
            {
                name: 'Last 20品牌',
                type: 'bar',
                data: lastBrands.map(item => item.value),
                itemStyle: {
                    color: new graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#f44336' },
                        { offset: 1, color: '#EF9A9A' }
                    ])
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
                }
            }
        ]
    };
};

export const lineOptions = {
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value',
    },
    color: ['#009688', '#f44336'],
    series: [
        {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310],
        },
    ],
};

export const pieOptions = {
    title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
};

export const wordOptions = {
    series: [
        {
            type: 'wordCloud',
            rotationRange: [0, 0],
            autoSize: {
                enable: true,
                minSize: 14,
            },
            textStyle: {
                fontFamily: '微软雅黑,sans-serif',
                color: function () {
                    return (
                        'rgb(' +
                        [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                        ].join(',') +
                        ')'
                    );
                },
            },
            data: [
                {
                    name: 'Vue',
                    value: 10000,
                },
                {
                    name: 'React',
                    value: 9000,
                },
                {
                    name: '图表',
                    value: 4000,
                },
                {
                    name: '产品',
                    value: 7000,
                },
                {
                    name: 'vue-manage-system',
                    value: 2000,
                },
                {
                    name: 'element-plus',
                    value: 6000,
                },
                {
                    name: '管理系统',
                    value: 5000,
                },
                {
                    name: '前端',
                    value: 4000,
                },
                {
                    name: '测试',
                    value: 3000,
                },
                {
                    name: '后端',
                    value: 8000,
                },
                {
                    name: '软件开发',
                    value: 6000,
                },
                {
                    name: '程序员',
                    value: 4000,
                },
            ],
        },
    ],
};

export const ringOptions = {
    tooltip: {
        trigger: 'item',
    },
    legend: {
        top: '5%',
        left: 'center',
    },

    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold',
                },
            },
            labelLine: {
                show: false,
            },
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' },
            ],
        },
    ],
};

export const dashOpt1 = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
        type: 'value',
    },
    grid: {
        top: '2%',
        left: '2%',
        right: '3%',
        bottom: '2%',
        containLabel: true,
    },
    color: ['#009688', '#f44336'],
    series: [
        {
            type: 'line',
            areaStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(0, 150, 136,0.8)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(0, 150, 136,0.2)',
                    },
                ]),
            },
            smooth: true,
            data: [120, 132, 301, 134, 90, 230, 210],
        },
        {
            type: 'line',
            smooth: true,
            data: [220, 122, 191, 234, 190, 130, 310],
        },
    ],
};

// 生成能源分布图配置（动态数据）
export const getEnergyDistributionOptions = (energyData: { energy_name: string; count: number }[]) => {
    // 将后端数据转换为ECharts需要的格式
    // console.log('123456');
    // console.log(energyData);
    const chartData = energyData.map(item => ({
        value: item.count,
        name: item.energy_name
    }));

    return {
        legend: {
            bottom: '1%',
            left: 'center',
        },
        color: ['#3f51b5', '#009688', '#f44336', '#00bcd4', '#1ABC9C', '#e9a745', '#f25e43', '#64d572'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
            {
                name: '能源类型分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    formatter: '{b}: {c}'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                data: chartData,
            },
        ],
    };
};

// 保留原有的静态配置（兼容性）
export const dashOpt2 = {
    legend: {
        bottom: '1%',
        left: 'center',
    },
    color: ['#3f51b5', '#009688', '#f44336', '#00bcd4', '#1ABC9C'],
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            data: [
                { value: 1048, name: '数码' },
                { value: 735, name: '食品' },
                { value: 580, name: '母婴' },
                { value: 484, name: '家电' },
                { value: 300, name: '运动' },
            ],
        },
    ],
};

// 生成城市销售地图配置（动态数据）- 使用自定义地图
export const getCitySalesOptions = (cityData: { city: string; sales: number }[]) => {
    // 将后端数据转换为ECharts需要的格式
    const chartData = cityData.map(item => ({
        name: item.city,
        value: item.sales
    }));

    return {
        tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
                // 自定义tooltip显示格式
                return `${params.name}<br/>销售额: ${params.value}`;
            }
        },
        visualMap: {
            show: true,
            type: 'continuous',
            min: Math.min(...cityData.map(item => item.sales)),
            max: Math.max(...cityData.map(item => item.sales)),
            text: ['高销售额', '低销售额'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#FFD700', '#FFA500', '#FF6347', '#FF4500', '#FF0000'],
            },
            textStyle: {
                color: '#333',
                fontSize: 12
            },
            orient: 'vertical',
            right: '3%',
            top: 'center'
        },
        series: [
            {
                name: '城市销售额',
                type: 'map',
                map: 'china', // 使用自定义地图名称
                roam: true, // 允许缩放和平移
                center: [105, 36], // 设置地图中心点
                zoom: 1.2, // 设置初始缩放级别
                data: chartData,
                emphasis: {
                    label: {
                        show: true,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        areaColor: '#FF4500'
                    }
                },
                itemStyle: {
                    areaColor: '#87CEEB',
                    borderColor: '#4169E1',
                    borderWidth: 0.8
                },
                label: {
                    formatter: '{b}',
                    color: '#333',
                    fontSize: 9, // 减小字体大小
                    fontWeight: 'normal',
                    show: true, // 默认显示标签
                    emphasis: {
                        show: true, // 鼠标悬停时显示标签
                        fontSize: 10,
                        fontWeight: 'bold'
                    }
                },
                labelLayout: {
                    // 使用ECharts内置的标签密度控制
                    hideOverlap: true, // 隐藏重叠的标签
                    moveOverlap: 'shiftY', // 移动重叠的标签
                    draggable: false, // 标签不可拖动
                    maxCount: 10 // 限制最大显示标签数量，避免过度拥挤
                }
            },
        ],
    };
};

// 保留原有的静态配置（兼容性）
export const mapOptions = {
    tooltip: {
        trigger: 'item',
    },
    visualMap: {
        show: false,
        min: 0,
        max: 100,
        realtime: false,
        calculable: false,
        inRange: {
            color: ['#d2e0f5', '#71A9FF'],
        },
    },
    series: [
        {
            name: '地域分布',
            type: 'map',
            map: 'china',
            roam: false,
            data: [
                { name: '北京', value: 100 },
                { name: '上海', value: 100 },
                { name: '广东', value: 100 },
                { name: '浙江', value: 90 },
                { name: '江西', value: 80 },
                { name: '山东', value: 70 },
                { name: '广西', value: 60 },
                { name: '河南', value: 50 },
                { name: '河南', value: 40 },
                { name: '青海', value: 70 },
                { name: '河南', value: 30 },
                { name: '黑龙江', value: 20 },
                { name: '新疆', value: 20 },
                { name: '云南', value: 20 },
                { name: '甘肃', value: 20 },
            ],
            label: {
                show: false, // 静态地图默认不显示标签
            }
        },
    ],
};