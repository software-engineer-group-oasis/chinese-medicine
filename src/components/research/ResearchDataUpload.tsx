import { Form, Input, Select, Button, Upload, Space, Card, UploadProps, message } from "antd";
import { Tabs } from "antd";
import { useState, useEffect } from "react"
import {UploadOutlined} from "@ant-design/icons";
import axiosInstance from "@/api/config";

export default function ResearchDataUpload({contentId}:
{
    contentId:number
}) {

    const [count, setCount] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState("");

//@ts-ignore
    const postData = async (url:string, body)=> {
        const res = await axiosInstance.post(url, body)
        const data = res.data;
        if (data.code === 0) {
            message.success("上传成功")
            setCount(prev => prev + 1)
        } else throw new Error(data.message)
    }
// @ts-ignore
    const uploadData = async(values)=> {
        if (values.contentBlockType === 0) {
            let blocks = [];
            blocks[0] = {...values, contentBlockOrder: count}
            try {
               await postData(`/herb-research-service/contents/${contentId}/details`, blocks)
            } catch (e) {
            // @ts-ignore
                console.error(e.message)
                message.error("服务器错误")
            }
        }
        if (values.contentBlockType === 1) {
            let blocks = []
            blocks[0] = {...values, contentBlockOrder: count, contentBlockUrl: imageUrl}
            try {
                await postData(`/herb-research-service/contents/${contentId}/details`, blocks)
            } catch (e) {
            // @ts-ignore
                console.error(e.message)
                message.error("服务器错误")
            }
        }
    }

    const props: UploadProps = {
        accept: "image/*",
        maxCount: 1,
        name: 'upload-file',
        action: '/api/tencent-cos',
        headers: {
            contentType: "multipart/form-data"
        },
        onRemove(file) {
            setImageUrl("");
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
                setImageUrl(info.file.response.url);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
    };


   return (
   <Card title={<div className="font-bold text-2xl">上传数据</div>} className="w-[80%]">
    <Tabs defaultActiveKey="1">
            <Tabs.TabPane key="1" tab="纯文本">
                <Card>
                    <Form onFinish={uploadData}>
                        <Form.Item hidden name="contentBlockType" initialValue={0}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="内容" name="contentBlockDes" rules={[{required:true, message: "请输入内容"}]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Button htmlType="submit" type="primary">提交</Button>
                    </Form>
                </Card>
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="文本+图片">
                <Card>
                    <Form layout="vertical" onFinish={uploadData}>
                        <Form.Item hidden name="contentBlockType" initialValue={1}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="内容" name="contentBlockDes" rules={[{required:true, message: "请输入内容"}]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>点击上传图片</Button>
                        </Upload>
                        {imageUrl &&  <img src={imageUrl} className="w-[128px] aspect-square h-auto object-cover" alt="研究资料图片"/>}
                        <Button htmlType="submit" type="primary">提交</Button>
                    </Form>
                </Card>
            </Tabs.TabPane>
    </Tabs>
   </Card>
   )
}
