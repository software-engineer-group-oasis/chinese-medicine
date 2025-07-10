"use client"

import {useSearchParams} from "next/navigation";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {Avatar, List, message, Skeleton, Space, Typography} from 'antd';
import React, {Suspense, useEffect, useState} from "react";
import {Topic} from "@/constTypes/research";
import {parseMergedHandlers} from "@use-gesture/core";
import axiosInstance from "@/api/config";
import axios from "axios";
const { Title, Paragraph, Text, Link } = Typography;

const data = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

function QueryPage() {
    const params = useSearchParams()
    const query = params.get("query")
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(false)
    const fetchTopics = async()=> {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/herb-research-service/topics/search?query="+query)
            const data = res.data;
            if (data.code === 0) {
                setTopics(data.topics);
                console.log("topics:", data.topics)
            }
            else throw new Error(data.message || "请求数据失败")
        } catch (err) {
        //@ts-ignore
            message.error(err.message)
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchTopics();
    }, [query]);
    return (
        <>
            <div className={'py-15 px-10 flex flex-col gap-10 items-center'}>
                <header><h1 className={'text-2xl tracking-widest'}>检索<b className={'text-green-700 text-4xl'}>{params.get('query')}</b>的结果</h1></header>
                <List
                    className={'py-200'}
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={topics}
                    footer={
                        <div>
                            <img src={'/images/草药.svg'} className={'w-4 aspect-square'}/>
                            <b>中药智慧平台</b>
                        </div>
                    }
                    renderItem={(topic:Topic) => (
                        <List.Item
                            key={topic.topicId}
                            // actions={[
                            //     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            //     <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                            //     <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            // ]}
                            // extra={
                            //     <img
                            //         width={272}
                            //         alt="logo"
                            //         src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            //     />
                            // }
                        >
                            {/*<List.Item.Meta*/}
                            {/*    avatar={<Avatar src={item.avatar} />}*/}
                            {/*    title={<a href={item.href}>{item.title}</a>}*/}
                            {/*    description={item.description}*/}
                            {/*/>*/}
                            {/*{topic.topicName}*/}
                            <Typography>
                                <Link href={`/main/research/query/detail?topicId=${topic.topicId}`}>
                                    <Title className="hover:underline">{topic.topicName}</Title>
                                </Link>
                                <Paragraph>
                                    <pre>简述：{topic.topicDes}</pre>
                                    <pre>时间：{new Date(topic.topicStartTime).toLocaleDateString()}-{new Date(topic.topicEndTime).toLocaleDateString()}</pre>
                                </Paragraph>
                            </Typography>
                        </List.Item>
                    )}
                />
            </div>

        </>
    )
}

export default function Page() {
    return (
    <Suspense fallback={<Skeleton />}>
        <QueryPage />
    </Suspense>
    )
}