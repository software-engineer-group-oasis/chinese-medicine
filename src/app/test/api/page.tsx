"use client"
import {getHerbsByLocation} from '@/api/HerbInfoApi'
import {useEffect, useState} from "react";
import {Location} from '@/constTypes/herbs';

export default function TestApi() {
    const [herbs, setHerbs] =  useState<Location []>([]);
    useEffect(()=> {
        getHerbsByLocation('万州区').then(res => setHerbs(res.data.locations))
    }, [])

    return (
        <>
            <div>
                <h1>测试</h1>
                {herbs && herbs.map((item, index)=>(
                    <ul key={index}>
                        <li>名称： {item.herbName}</li>
                        <li>地址：{"重庆市"+item.districtName+item.streetName}</li>
                        <li>经纬度：{"["+item.longitude},{item.latitude+"]"}</li>
                    </ul>
                ))}
            </div>
        </>
    );
}
