"use client"
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Contents, Topic} from "@/constTypes/research";
import axiosInstance from "@/api/config";
import {message, Typography, Table, Skeleton, Card} from "antd";
import useAxios from "@/hooks/useAxios";
import { Document } from "@/constTypes/research";
import { GlimmeringButton } from "@/components/GlimmeringButton";
import Link from "next/link";
import TeamContentsTable from "@/components/research/TeamContentsTable";

const { Title, Paragraph} = Typography;

const columns = [
    {title: "文件名", dataIndex: "documentName", key: "documentName"},
    {title: "简述", dataIndex: "documentDes", key: "documentDes"},
    {title: "文件类型", dataIndex: "documentType", key: "documentType"},
    {title: "上传时间", dataIndex: "documentTime", key: "documentTime"},
    {title: "链接", dataIndex: "documentUrl", key: "documentUrl",
        render: (text:string) => {
            return <a href={text} target="_blanck">{text}</a>
        }
    },
    {title: "上传者ID", dataIndex: "userId", key: "userId"},


]
export default function ResearchQueryDetailPage() {
    const params = useSearchParams()
    const topicId = params.get("topicId") || "";
    const [topic, setTopic] = useState<Topic>()
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<Document[]>([]);
    const [contents, setContents] = useState<Contents[]>([]);

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
//@ts-ignore
    const {data:FilesData} = useAxios(`/herb-research-service/files/topic/${topicId}/all`)
    //@ts-ignore
    const {data:ContentsData} = useAxios(`/herb-research-service/contents/topic/${topicId}`)

    useEffect(() => {
        fetchTopicByTopicId();
    }, [topicId]);

    useEffect(()=> {
    //@ts-ignore
        if (FilesData && FilesData.documents) {
            //console.log(FilesData.documents)
            //@ts-ignore
            setFiles(FilesData.documents)
        }
        //@ts-ignore
        if (ContentsData && ContentsData.contents) {
        //@ts-ignore
            console.log("contents: ", ContentsData.contents)
            //@ts-ignore
            setContents(ContentsData.contents)
        }
    },[FilesData, ContentsData])
    

    if (loading || !topic || !files) {
        return <Skeleton active/>
    }

    

    return (
    <>
        <div className="fixed right-8 bottom-8">
            <GlimmeringButton><Link href={`/main/research/upload-file?topicId=${topicId}`}>上传文件</Link></GlimmeringButton>
        </div>
        <div className="fixed right-8 bottom-28">
            <GlimmeringButton><Link href={`/main/research/upload?topicId=${topicId}`}>发布资料</Link></GlimmeringButton>
        </div>
        <div className="flex flex-col gap-8 justify-center items-center">
            <div className="w-[80%]">
                <Card>
                    <Typography>
                        <Title>课题名：{topic?.topicName}</Title>
                        <Paragraph>
                            <pre>团队名称：{topic?.teamName}</pre>
                            <pre>课题状态: {topic?.statusName}</pre>
                            <pre>课题概述: {topic?.topicDes}</pre>
                            <pre>时间：{new Date(topic?.topicStartTime).toLocaleDateString()}-{new Date(topic?.topicEndTime).toLocaleDateString()}</pre>
                        </Paragraph>
                    </Typography>
                </Card>
            </div>
            <div className="w-[80%]">
                <Card title={<div className="text-2xl font-bold">课题文件</div>}>
                        <Table dataSource={files} columns={columns} pagination={{
                            pageSize: 5,
                        }}/>
                </Card>
            </div>
            <TeamContentsTable contents={contents}/>
        </div>
    </>
    
        
    )
}