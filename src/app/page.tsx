// 首页，展示重庆市地图数据
"use client"
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import chongQingJson from "@/assets/chongQing.json"
import {useRouter} from "next/navigation"
import Link from 'next/link';

echarts.registerMap('chongQing', {geoJSON: chongQingJson });
console.log(chongQingJson)

const option: echarts.EChartOption = {
    backgroundColor: 'rgba(12, 32, 56, 0.8)',
    animation: true,
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
    title: {
        text: '重庆中药材分布图',
        textStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18
        },
        left: "center",
        top: 20
    },
    visualMap: {
        min: 0,
        max: 300,
        inRange: {
            color: ['#5B8FF9', '#61DDAA', '#F6BD16', '#F6903D', '#E8684A']
        },
        text: ['高值', '低值'],
        textStyle: {
            color: '#fff'
        },
        calculable: true,
        bottom: 40,
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
        emphasis: {
            areaColor: '#2a333d',
            borderColor: '#111'
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
    function handleClick(params: any) {
        const encodedName = encodeURIComponent(params.name);
        router.push(`/secondary_district?name=${encodedName}&value=${params.value || 0}`)
    }

    return (
        <>
            <div className="w-full h-[80vh] min-h-[500px]">
                <ReactEcharts
                    option={option}
                    style={{ width: '100%', height: '100%' }}
                    onEvents={{ click: handleClick }}
                />
            </div>
        </>
        )

}

export default chongQingMap;