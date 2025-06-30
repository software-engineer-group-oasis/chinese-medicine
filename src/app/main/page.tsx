// 首页，展示重庆市地图数据
"use client"
import React, {useEffect, useRef} from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import chongQingJson from "@/assets/chongQing.json"
import {useRouter} from "next/navigation"
import TreeOrigins from "@/components/TreeOrigins";
import ChongqingHerbs from "@/components/ChongqingHerbs";
import IndexDataTable from "@/components/IndexDataTable";
import IndexPieChart from "@/components/IndexPieChart";

echarts.registerMap('chongQing', {geoJSON: chongQingJson });
// console.log(chongQingJson)

const herbPercentageData = [
    { name: '黄连', value: 35 },
    { name: '川贝母', value: 25 },
    { name: '天麻', value: 15 },
    { name: '杜仲', value: 10 },
    { name: '其他', value: 15 }
];

// 用于滚动表格box-1
const initialData = [
    { id: 1, name: '黄连', value: 35 },
    { id: 2, name: '川贝母', value: 25 },
    { id: 3, name: '天麻', value: 15 },
    { id: 4, name: '杜仲', value: 10 },
    { id: 5, name: '其他', value: 15 }
];

const pieOption: echarts.EChartOption = {
    title: {
        text: '重庆主要中药材占比',
        left: 'center',
        textStyle: {
            color: '#FFF',
            fontSize: 24,
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        textStyle: {
            color: '#fff'
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
            color: '#FFF'
        }
    },
    series: [
        {
            name: '中药材占比',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {d}%',
                color: '#FFF'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true
            },
            data: herbPercentageData
        }
    ],
    animation: true,
    animationEasing: 'elasticOut',
};

const option: echarts.EChartOption = {
    // backgroundColor: 'rgba(12, 32, 56, 0.8)',
    animation: true,
    animationType: 'linear',
    animationDuration: 2000,
    animationEasing: 'cubicOut',
    tooltip: {
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        borderColor: '#333',
        textStyle: {
            color: '#fff'
        },
        trigger: 'item',
        formatter: (params) => {
            return `${params.name}<br/>数值：${params.value || 0}`;
        }
    },
    itemStyle: {
        color: '#00BFFF',
        borderColor: '#FFA500',
        borderWidth: 2,
    },
    title: {
        text: '重庆中药材分布图',
        textStyle: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 32
        },
        left: 'center',
        top: 20
    },
    visualMap: { // 热力图
        min: 0,
        max: 300,
        inRange: {
            color: ['#5B8FF9', '#61DDAA', '#F6BD16', '#F6903D', '#E8684A']
        },
        text: ['高值', '低值'],
        textStyle: {
            color: '#FFF'
        },
        calculable: true,
        bottom: 40,
        left: 40,
    },
    series: [{
        type: 'map',
        map: 'chongQing', // 这里必须已经通过 registerMap 注册过
        roam: true,
        label: {
            show:true,//显示标签
            formatter: (params) => {
                return params?.name || ''
            },
        },
        layoutCenter: ['45%', '50%'],
        layoutSize: '80%',
        emphasis: { // 鼠标移入
            itemStyle: {
                color: '#2a333d',
                borderColor: '#111',
                shadowBlur: 10,
                shadowColor: 'rgba(255, 165, 0, 0.8)' // 光晕
            }
        },
        data: [
            {
                name: "云阳县",
                value: 120,
            },
            {
                name: "涪陵区",
                value: 345,
            },
            {
                name: "渝北区",
                value: 200,
            },
        ]
    }]
};

function chongQingMap() {
    const router = useRouter();
    function handleClick(params:never) {
        const encodedName = encodeURIComponent(params.name);
        router.push(`/secondary_district?name=${encodedName}&value=${params.value || 0}`)
    }

    return (
        <>
            <div id={'chart-container'} className="my-4 w-[80%] h-[80vh] min-h-[500px] mx-auto rounded-3xl shadow-amber400 shadow-md ">
                <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: 'url(/images/index_bg.png)' }}></div>
                <ReactEcharts
                    option={option}
                    style={{ width: '100%', height: '100%'}}
                    onEvents={{ click: handleClick }}
                />
                <div id={'data-table'}>
                    <IndexDataTable initialData={initialData} />
                </div>
                <div id={'index-pie-chart'}>
                    <IndexPieChart pieOption={pieOption} />
                </div>
            </div>

            <TreeOrigins />
            <ChongqingHerbs />


            <style jsx>{`
                #chart-container {
                    position: relative;
                    overflow: hidden;
                }
                #data-table {
                    position: absolute;
                    top: 12%;
                    left: 2%;
                    width: 30%;
                }
                #index-pie-chart {
                    position: absolute;
                    bottom:12%;
                    right: 0;
                    width: 40%;
                }
              
              #chart-container .absolute {
                  z-index: -1;
              }

              #chart-container::before,
              #chart-container::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -50%;
                  width: 200%;
                  height: 5rem;
                  background: linear-gradient(90deg, transparent, oklch(74.6% 0.16 232.661), transparent);
                  animation: moveHorizontal 5s ease-in-out infinite;
              }

              #chart-container::after {
                  top: auto;
                  bottom: 0;
                  animation-delay: 2.5s;
              }

              @keyframes moveHorizontal {
                  0% { transform: translateX(-50%); }
                  50% { transform: translateX(50%); }
                  100% { transform: translateX(-50%); }
              }
            `}
            </style>


        </>
        )

}

export default chongQingMap;