"use client"
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Topic} from "@/constTypes/research";
import axiosInstance from "@/api/config";
import {message, Typography} from "antd";

const { Title, Paragraph, Text, Link } = Typography;

export default function ResearchQueryDetailPage() {
    const params = useSearchParams()
    const topicId = params.get("topicId") || "";
    const [topic, setTopic] = useState<Topic>()
    const [loading, setLoading] = useState(false)

    const fetchTopicByTopicId = async()=> {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/herb-research-service/topics/${topicId}`)
            const data = res.data;
            if (data.code === 0) {
                console.log(data);
                setTopic(data.topic)
            } else throw new Error(data.message || "数据请求失败")
        } catch (err) {
            message.error("数据请求失败")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTopicByTopicId();
    }, [topicId]);

    if (loading || !topic) {
        return <div>加载中...</div>
    }

    return (
        <div>
            <Typography>
                <Title>{topic?.topicName}</Title>
                <Paragraph>
                    <pre>团队名称：{topic?.teamName}</pre>
                    <pre>课题状态: {topic?.statusName}</pre>
                    <pre>课题概述: {topic?.topicDes}</pre>
                    <pre>时间：{new Date(topic?.topicStartTime).toLocaleDateString()}-{new Date(topic?.topicEndTime).toLocaleDateString()}</pre>
                </Paragraph>
            </Typography>
        </div>
    )
}