import {chongQingHerbs} from "@/mock/data";
import React, {useEffect, useRef} from "react";
import {gsap} from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

export default function ChongqingHerbs() {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
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
            <div className={'flex justify-center'}>
                <div className={'flex flex-col gap-10 max-w-[50%]'}>
                    {chongQingHerbs.map((item, index) => (
                        <div key={index} className="herb-card flex gap-6 border-stone-900 border-2 rounded-2xl py-10 px-5"
                             ref={el => cardRefs.current[index] = el}>
                            { index % 2 === 0 && (
                                <>
                                    <div><img src={item.image} className="w-[10rem] aspect-square rounded-2xl object-cover shadow-stone-600 shadow-md"/></div>
                                    <div className={'flex-1'}>
                                        <div className={'font-bold text-3xl'}>{item.name}</div>
                                        <div className={'py-8'}>{item.description}</div>
                                    </div>
                                </>
                            )}
                            {
                                index % 2 === 1 && (
                                    <>
                                        <div className={'flex-1'}>
                                            <div className={'font-bold text-3xl'}>{item.name}</div>
                                            <div className={'py-8'}>{item.description}</div>
                                        </div>
                                        <div><img src={item.image} className="w-[10rem] aspect-square rounded-2xl object-cover shadow-stone-600 shadow-md"/></div>
                                    </>
                                )
                            }
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
            `}
            </style>
        </>
    )
}