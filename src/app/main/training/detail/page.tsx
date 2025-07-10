// 展示某门培训课程的详细信息
"use client";
import {Suspense, useEffect, useState} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, Rate, Button, Image, Typography, Divider, Skeleton } from "antd";
import {MaterialContent, MaterialFull} from "@/constTypes/materials";
import axiosInstance from "@/api/config";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

function TrainingDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const key = searchParams.get('key') || '1';

    const [material, setMaterial] =  useState<MaterialFull>({
        contents: [],
        count: 0,
        des: "",
        herbId: 0,
        herbName: "",
        id: 0,
        time: "",
        title: "",
        type: "",
        userId: 0,
        userName: ""
    })

    useEffect(() => {
        axiosInstance.get(`/herb-training-service/material/info/${key}`)
            .then(res => {
                if (res.data.code === 0) {
                    //console.log("data", res.data);
                    //console.log("material: ", res.data.material);
                    setMaterial(res.data.material)
                } else {
                    throw new Error("请求API失败")
                }
            })
            .catch(error => {
                console.error(error.message);
            })
    }, [key]);

    // 返回按钮点击事件
    const handleBackClick = () => {
        router.back();
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* 返回按钮 */}
            <Button type="link" onClick={handleBackClick} className="mb-4">
                &lt; 返回列表
            </Button>

             课程卡片
            <Card
                className="shadow-lg"
            >
                {/* 标题区域 */}
                <div className="flex justify-between items-start mb-4">
                    <Title level={2} className="text-2xl font-bold">{material.title}</Title>
                    <div className="text-right">
                        <Text className="block text-gray-500 mb-2">{material.type}</Text>
                        <Rate disabled value={6} className="text-xl" />
                        <Text className="ml-2">({6})</Text>
                    </div>
                </div>

                {/* 描述 */}
                <Paragraph className="text-gray-700 mb-6">
                    {material.des}
                </Paragraph>

                <Divider />

                {/* 主要内容 */}
                {
                    material && material.contents && (
                        <>
                            {
                                material.contents.map((item:MaterialContent) => (
                                    <div key={item.id}>
                                        <div className="mb-8">
                                            <Title level={3} className="text-xl font-semibold mb-4">材料{item.id}</Title>
                                            <Paragraph className="whitespace-pre-line text-gray-600">
                                                <div>
                                                    <div>文件类型：{item.type}</div>
                                                    <div>主要内容：{item.des}</div>
                                                </div>
                                            </Paragraph>
                                            {
                                                item.url && <Link href={item.url}>{item.des}</Link>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    )
                }


                <Divider />

                {/* TODO 此处后端只有获取当前用户评价的接口，没有根据资料ID获取对应资料的接口 */}
                {/* http://localhost:8090/herb-training-service/feedback/me */}
                {/* 用户评价 */}
                {/*<div>*/}
                {/*    <Title level={3} className="text-xl font-semibold mb-4">用户评价</Title>*/}

                {/*    {data.reviews.length === 0 ? (*/}
                {/*        <Text type="secondary" className="text-gray-500">暂无评价</Text>*/}
                {/*    ) : (*/}
                {/*        <div className="space-y-6">*/}
                {/*            {data.reviews.map(review => (*/}
                {/*                <div key={review.id} className="border-b border-gray-100 pb-4">*/}
                {/*                    <div className="flex justify-between mb-2">*/}
                {/*                        <Text strong>{review.user}</Text>*/}
                {/*                        <Rate disabled value={review.score} size="small" />*/}
                {/*                    </div>*/}
                {/*                    <Paragraph className="text-gray-600">{review.comment}</Paragraph>*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
            </Card>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Skeleton active/>}>
            <TrainingDetailPage />
        </Suspense>
    )
}
