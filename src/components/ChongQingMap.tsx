import React, {Suspense} from 'react';
import ReactEcharts from "echarts-for-react";
import {useRouter} from "next/navigation";
import type { EChartsOption } from 'echarts-for-react';

const ChongQingMap = ({option}: {
    option: EChartsOption;
}) => {
    const router = useRouter();

    function handleClick(params:never) {
        const encodedName = encodeURIComponent(params.name);
        router.push(`/main/secondary_district?name=${encodedName}&value=${params.value || 0}`)
    }



    return (
        <>
            <Suspense fallback={<div>加载中....</div>}>
                <ReactEcharts
                    option={option}
                    style={{ width: '100%', height: '100%'}}
                    onEvents={{ click: handleClick }}
                />
            </Suspense>
        </>
    );
};

export default ChongQingMap;