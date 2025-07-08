"use client"
import axiosInstance from "@/api/config";
import { Contents, ContentBlock } from "@/constTypes/research";
import { Card, message } from "antd";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function ContentBlocksPage() {
    const params = useSearchParams();
    const contentId = params.get("contentId") || "";

    const [contents, setContents] = useState<Contents>();
    const fectchContents = async()=> {
        try {
            const res = await axiosInstance.get(`/herb-research-service/contents/${contentId}/details`)
            const data = res.data;
            console.log("contents:", data);
            if (data.code === 0) {
                setContents(data.contents)
            } else throw new Error(data.message)
        } catch (e) {
            console.error(e.message);
            message.error("请求数据失败")
        }
    }

    useEffect(()=> {
        fectchContents()
    }, [])

    if (!contentId) {
        return <div>404</div>
    }

    return (
        <div className="flex justify-center items-center">
        <Card title={<div className="font-bold text-2xl">{contents?.contentName}</div>} className="w-[80%] flex flex-col gap-4">
            {
                contents?.contentBlocks.map((block:ContentBlock, index:number)=> (
                    <div key={index}>
                        <Card>
                            <div>{block.contentBlockDes}</div>
                            {
                                block.contentBlockUrl && <img src={block.contentBlockUrl} className="w-[128px] aspect-square h-auto"/>
                            }
                        </Card>
                    </div>
                ))
            }
        </Card>
        </div>
    )
}