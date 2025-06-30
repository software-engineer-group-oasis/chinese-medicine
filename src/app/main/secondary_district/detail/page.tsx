"use client"

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {getHerbLocationsByName} from "@/api/HerbInfoApi";
import {Location} from "@/const/types";
import { Card, List } from "antd";
import React from "react";
import GrowthTimeline from "@/components/GrowthTimeline";

export default function HerbDetailPage() {
    const params = useSearchParams();
    const herbId = params.get('herbId')
    const herbName = params.get('herbName')

    const [location, setLocation] = useState<Location>()
    useEffect(() => {
        getHerbLocationsByName(herbName as string)
            .then(res => {
                setLocation(res.data.locations.filter((l:Location) => l.herbId === Number(herbId))[0])
            })
    }, []);
    return (
        <div className="p-4">
            <Card title="药材详情" variant={"outlined"} style={{ width: '100%' }}>
                <List
                    dataSource={[
                        { label: "药材编号", value: location?.herbId },
                        { label: "药材名称", value: location?.herbName },
                        { label: "数量", value: location?.count },
                        { label: "产地", value: location?.streetName },
                        { label: "经度", value: location?.longitude },
                        { label: "纬度", value: location?.latitude }
                    ]}
                    renderItem={(item) => (
                        <List.Item>
                            <strong>{item.label}:</strong> {item.value}
                        </List.Item>
                    )}
                />
            </Card>
            <Card title={"药材成长时间线"} variant={'outlined'}>
                <GrowthTimeline />
            </Card>

        </div>
    );
}
