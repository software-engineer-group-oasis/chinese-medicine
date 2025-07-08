// 首页，展示重庆市地图数据
"use client"
import React, {useEffect, useState} from 'react';
import type {EChartsOption} from 'echarts-for-react';
import * as echarts from 'echarts';
import chongQingJson from "@/assets/chongQing.json"
import TreeOrigins from "@/components/TreeOrigins";
import ChongqingHerbs from "@/components/ChongqingHerbs";
import IndexDataTable from "@/components/IndexDataTable";
import IndexPieChart from "@/components/IndexPieChart";
import axiosInstance from "@/api/config";
import ChongQingMapOption from "@/config/ChongQingMapOption";
import ChongQingMap from "@/components/ChongQingMap";
import {StatsByDistrict, StatsByHerb} from "@/constTypes/herbs";
import IndexPieOption from "@/config/IndexPieOption";
import SearchHerb from '@/components/SearchHerb';

echarts.registerMap('chongQing', {geoJSON: chongQingJson});
// console.log(chongQingJson)


export default function ChongQingMapPage() {

    const [chongQingMapOption, setChongQingMapOption] = useState<EChartsOption>({});
    const [pieOption, setPieOption] = useState<EChartsOption>({});


    useEffect(() => {
        axiosInstance.get("/herb-info-service/herbs/location/count/districts").then(res => {
            if (res.data.code === 0) {
                let max = 0;
                for (let i = 0; i < res.data.result.length; i++) {
                    if (res.data.result[i].herbCount > max) {
                        max = res.data.result[i].herbCount;
                    }
                }
                const data = res.data.result.map((item: StatsByDistrict) => ({
                    name: item.districtName,
                    value: item.herbCount
                }))
                setChongQingMapOption(ChongQingMapOption({data, max}))
            } else {
                throw new Error("获取数据失败")
            }

        }).catch(err=> {
            console.error(err.message);
        })
    }, []);

    useEffect(() => {
        axiosInstance.get("/herb-info-service/herbs/location/count/topHerbs").then(res => {
            if (res.data.code === 0) {
                console.log("统计信息",res.data);
                const data = res.data.result.map((item:StatsByHerb) => (
                    {
                        name: item.herbName,
                        value: item.herbNumber
                    }
                ))
                setPieOption(IndexPieOption({data}));
            } else {
                console.error(res.data.message);
            }
        }).catch(err => {
            console.error(err.message);
        })
    }, []);

    return (
        <>
            <div>
                <div id={'chart-container'}
                     className="my-4 w-full h-[80vh] min-h-[500px] shadow-amber400 shadow-md ">
                    <div className="absolute inset-0 bg-cover bg-center "
                         style={{backgroundImage: 'url(/images/index_bg.png)'}}></div>
                    <ChongQingMap option={chongQingMapOption}/>
                    <div id={'data-table'}>
                        <IndexDataTable />
                    </div>
                    <div id={'index-pie-chart'}>
                        <IndexPieChart pieOption={pieOption}/>
                    </div>
                </div>

                <TreeOrigins/>
                <ChongqingHerbs/>


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
                    bottom: 12%;
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
                    0% {
                        transform: translateX(-50%);
                    }
                    50% {
                        transform: translateX(50%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}
                </style>


            </div>
        </>

    )

}