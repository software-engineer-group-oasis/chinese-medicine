import {Suspense, useEffect, useState} from "react";
import {HerbGrowth} from "@/constTypes/herbs";
import axiosInstance from "@/api/config";
import {Card, List} from "antd";

type TraceInfoProps = {
    herbName: string
}

export default function TraceInfo({herbName}:TraceInfoProps) {
    const [herbTraces, setHerbTraces] = useState<HerbGrowth[]>([]);
    const [defaultHerbTraces, setDefaultHerbTraces] = useState<HerbGrowth[]>([]);
    const [batchCodeSet, setBatchCodeSet] = useState<Set<string>>(new Set<string>());
    useEffect(()=>{
        axiosInstance.get("/herb-info-service/growth/all")
            .then(res => {
                if (res.data.code === 0) {
                    setDefaultHerbTraces(res.data.herbGrowths.filter((g: HerbGrowth) => g.herbName === herbName))
                    setHerbTraces(res.data.herbGrowths.filter((g: HerbGrowth) => g.herbName === herbName))
                    const batchCodes = res.data.herbGrowths.filter((g:HerbGrowth) => g.herbName === herbName).map((g: HerbGrowth) => g.batchCode);
                    console.log("batchCodes:", batchCodes);
                    setBatchCodeSet(new Set(batchCodes));
                } else {
                    throw new Error("请求API失败");
                }
            })
            .catch(error => {
                console.error("请求API失败", error.message);
            })
    },[herbName])
    return (
        <>
            <Suspense fallback={<div>加载中...</div>}>
                <div>
                    <div className={'pb-4'}>
                        {
                            batchCodeSet.size > 0 && (
                                <>
                                    <p className={"p-2"}>批次号</p>
                                    <span className={'batch-code'} onClick={() => {
                                        setHerbTraces(defaultHerbTraces)
                                    }}>全部</span>
                                    {
                                        Array.from(batchCodeSet).map((batchCode) => {
                                            return <span className={'batch-code'}
                                                         onClick={() => {
                                                             setHerbTraces(defaultHerbTraces.filter((g: HerbGrowth) => g.batchCode === batchCode))
                                                         }}
                                                         key={batchCode}>{batchCode}</span>
                                        })
                                    }
                                    <hr style={{color: "green", marginTop: "1rem"}}/>
                                </>
                            )
                        }

                    </div>
                    <List
                        style={{
                            width: "80%",
                            margin: "0 auto",
                        }}
                        grid={{gutter: 16, column: 3}}
                        dataSource={herbTraces}
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <Card
                                    style={{
                                        backgroundImage: "linear-gradient(135deg, oklch(93.8% 0.127 124.321), oklch(64.8% 0.2 131.684))",
                                    }}
                                    title={item.herbName}
                                    extra={
                                        <span className={'text-grey-500'}>
                                        批次号: {item.batchCode}
                                    </span>
                                    }
                                >
                                    <div>
                                        <div>记录时间: {new Date(item.recordTime).toLocaleDateString()}</div>
                                        <div>湿度: {item.wet}%</div>
                                        <div>温度: {item.temperature}°C</div>
                                        <div>位置: 经度 {item.longitude}, 纬度 {item.latitude}</div>
                                        <div>描述: {item.des}</div>
                                        {item.imgUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.imgUrl} alt={'生长状况记录'} className={'mt-2 max-w-full h-auto rounded'}
                                                 onError={(e)=>{
                                                     e.currentTarget.src = "/images/no-content.png"
                                                 }}
                                            />
                                        ):(
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={"/images/no-content.png"} alt={'默认药材图片'} className={'mt-2 max-w-full h-auto rounded'}/>
                                        )}
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
                <style jsx>{`
                    .glow-border {
                        box-shadow: 0 0 8px rgba(253, 208, 133, 0.6),
                        0 0 16px rgba(253, 208, 133, 0.4),
                        0 0 24px rgba(253, 208, 133, 0.3);
                        transition: box-shadow 0.3s ease-in-out;
                    }
    
                    .glow-border:hover {
                        box-shadow: 0 0 12px rgba(253, 208, 133, 0.8),
                        0 0 24px rgba(253, 208, 133, 0.6),
                        0 0 32px rgba(253, 208, 133, 0.5);
                    }
                    
                    .batch-code {
                        border: 2px solid oklch(64.8% 0.2 131.684);
                        margin-left: 0.5rem;
                        padding: 0.5rem;
                        border-bottom-left-radius: 1rem;
                        transition: all 0.3s ease-in-out;
                    }
                    
                    .batch-code:hover {
                        border: 2px solid oklch(93.8% 0.127 124.321);
                    }
                `}</style>
            </Suspense>
        </>
    )
}