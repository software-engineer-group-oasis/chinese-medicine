// 首页，展示重庆市地图数据
"use client"
import React, {useEffect, useRef} from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import chongQingJson from "@/assets/chongQing.json"
import {useRouter} from "next/navigation"
import {chongQingHerbs} from '@/mock/data'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

echarts.registerMap('chongQing', {geoJSON: chongQingJson });
console.log(chongQingJson)

const option: echarts.EChartOption = {
    // backgroundColor: 'rgba(12, 32, 56, 0.8)',
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
            color: '#000',
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
            color: '#000'
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
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    function handleClick(params:never) {
        const encodedName = encodeURIComponent(params.name);
        router.push(`/secondary_district?name=${encodedName}&value=${params.value || 0}`)
    }

    useEffect(() => {
        // 确保所有卡片引用都已设置
        if (cardRefs.current.length > 0) {
            cardRefs.current.forEach((card, index) => {
                if (card) {
                    gsap.from(card, {
                        x: index % 2 === 0 ? -100 : 100, // 交替方向进入
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%", // 当卡片顶部到达视口80%时触发
                            toggleActions: "play none none none",
                            // markers: true // 调试时可用，显示触发位置
                        }
                    });
                }
            });
        }
    }, [])

    return (
        <>
            <div className="w-full h-[80vh] min-h-[500px]">
                <ReactEcharts
                    option={option}
                    style={{ width: '100%', height: '100%' }}
                    onEvents={{ click: handleClick }}
                />
            </div>
            <div className={'flex justify-center'}>
                <div className={'flex flex-col gap-10 max-w-[50%]'}>
                    {chongQingHerbs.map((item, index) => (
                        <div key={index} className="herb-card flex gap-6 border-stone-900 border-2 rounded-2xl py-10 px-5"
                             ref={el => cardRefs.current[index] = el}>
                            <div><img src={item.image} className="w-[10rem] aspect-square rounded-2xl object-cover shadow-stone-600 shadow-md"/></div>
                            <div className={'flex-1'}>
                                <div className={'font-bold text-3xl'}>{item.name}</div>
                                <div className={'py-8'}>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
              .herb-card {
                position: relative;
                border: 2px solid #000;
                border-radius: 1rem;
                overflow: hidden;
                z-index: 1;
                  background-color: oklch(79.2% 0.209 151.711);
              }
            
              .herb-card::before {
                content: '';
                position: absolute;
                top: 10px;
                left: 10px;
                right: -10px;
                bottom: -10px;
                backdrop-filter: blur(10px);
                  background: #fff;
                border-radius: 1rem;
                transform: translateZ(-1px);
                z-index: -1;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  border: 2px solid #000;
              }
            `}</style>


        </>
        )

}

export default chongQingMap;