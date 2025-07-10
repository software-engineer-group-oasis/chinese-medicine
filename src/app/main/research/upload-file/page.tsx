"use client"

import { Button, Card, Form, Input, message, Select, Skeleton, Upload } from "antd";
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react";
import {UploadOutlined} from "@ant-design/icons";
import axiosInstance from "@/api/config";
import getFileExtension from "@/utils/getFileExtension";


const { Option } = Select;

function UploadFilePage() {
    const params = useSearchParams();
    const topicId = params.get("topicId");
    const [documentForm] = Form.useForm();
    const [fileUrl, setFileUrl] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileList, setFileList] = useState([]);
//@ts-ignore
    const uploadDocument = async(values)=> {
        if (!fileType || !fileUrl) {
            message.error("文件上传失败")
            return;
        }
        try {
            const body = {
                ...values,
                documentType: fileType,
                documentUrl: fileUrl,
            }
            
            const res =  await axiosInstance.post("/herb-research-service/files/", body)
            const data = res.data;
            if (data.code === 0) {
                message.success("文件上传成功");
                documentForm.resetFields();
                setFileUrl("");
            } else throw new Error(data.message);       
        } catch (e) {
        //@ts-ignore
            console.error(e.message);
            //@ts-ignore
            message.error(e.message);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <Card title={<div className="font-bold text-2xl">文件上传</div>} className="w-[80%]">
                <Form form={documentForm} onFinish={uploadDocument} layout="vertical">
                    <Form.Item hidden name="topicId" initialValue={topicId}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="auth" label="权限" rules={[{required: true, message: "请选择权限"}]}>
                        <Select>
                            <Option value="私密">私密</Option>
                            <Option value="团队成员公开">团队成员公开</Option>
                            <Option value="公开">公开</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="documentName" label="文件名" rules={[{required: true, message: "请填写文件名"}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="documentDes" label="文件简介" rules={[{required: true, message: "请填写简洁"}]}>
                        <Input />
                    </Form.Item>
                    <Upload maxCount={1} action="/api/tencent-cos"
                        headers={{contentType:"application/json"}}
                        name="upload-file"
                        onChange={(info)=> {
                            if (info.file.status !== 'uploading') {
                                console.log(info.file, info.fileList);
                                setFileUrl(info.file.response.url);
                                setFileType(getFileExtension(info.file.response.url))
                            }
                            if (info.file.status === 'done') {
                                message.success(`${info.file.name} 上传成功`);
                                setFileList([])
                            } else if (info.file.status === 'error') {
                                message.error(`${info.file.name} 上传失败`);
                            }
                        }}>
                        <Button icon={<UploadOutlined />}>点击上传文件</Button>
                    </Upload>
                    <div className="py-3">
                        {fileUrl && <a href={fileUrl}>{fileUrl}</a>}
                    </div>
                    <Button htmlType="submit" type="primary">提交</Button>
                </Form>
            </Card>
        </div>
    )
}

export default function Page() {
    return (
    <Suspense fallback={<Skeleton active/>}>
        <UploadFilePage />
    </Suspense>
    )
}