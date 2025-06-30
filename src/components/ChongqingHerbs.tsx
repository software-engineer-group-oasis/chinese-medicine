import { chongQingHerbs } from "@/mock/data";
import React from "react";

export default function ChongqingHerbs() {
    return (
        <>
            <div className="flex justify-center">
                <div className="flex flex-col gap-10 max-w-[50%]">
                    {chongQingHerbs.map((item, index) => (
                        <div
                            key={index}
                            className={`herb-card flex gap-6 border-stone-900 border-2 rounded-2xl py-10 px-5`}
                        >
                            {index % 2 === 0 ? (
                                <>
                                    <div>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-[10rem] aspect-square rounded-2xl object-cover shadow-stone-600 shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-3xl">{item.name}</div>
                                        <div className="py-8">{item.description}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="font-bold text-3xl">{item.name}</div>
                                        <div className="py-8">{item.description}</div>
                                    </div>
                                    <div>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-[10rem] aspect-square rounded-2xl object-cover shadow-stone-600 shadow-md"
                                        />
                                    </div>
                                </>
                            )}
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
                    transition: all 0.3s ease;
                }

                .herb-card:hover {
                    background-color: oklch(90.5% 0.182 98.111);
                    border: 2px dashed #000;
                    padding: 4rem;
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
    );
}
