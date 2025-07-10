"use client";
import { Button, message, Input, Select, Form, Card } from "antd";
import React from "react";
import axiosInstance from "@/api/config";
const { Option } = Select;

export default function ResearchDataCreate({topicId,  onSuccess}: 
{
    topicId:string,
    onSuccess: (contentId:number)=>void 
}){
    const [createContentForm] = Form.useForm()
    
    // @ts-ignore
    const createContent = async(values)=> {
        console.log("values:",values);
        try {
            const res = await axiosInstance.post("/herb-research-service/contents/", values)
            const data = res.data;
            if (data.code === 0) {
                console.log("data: ", data)
                message.success("资料创建成功")
                onSuccess(data.content.contentId)
            } else throw new Error(data.message || "API请求失败")
        } catch (e) {
            message.error("资料上传失败");
        }
    }


    return (
    <>
    <Card title={<div className="text-2xl font-bold">创建研究材料</div>} className="w-[80%]">
        <Form form={createContentForm} onFinish={createContent} layout="vertical">
            <Form.Item hidden name="topicId" initialValue={topicId}>
                <Input />
            </Form.Item>
            <Form.Item label="类型" name="contentType" rules={[{ required: true, message: "请选择材料类型" }]}>
                <Select>
                    <Option value="论文">论文</Option>
                    <Option value="实验数据">实验数据</Option>
                    <Option value="分析报告">分析报告</Option>
                    <Option value="参考资料">参考资料</Option>
                </Select>
            </Form.Item>
            <Form.Item label="权限" name="auth" rules={[{ required: true, message: "请选择材料权限" }]}>
                <Select>
                    <Option value="私有">私有</Option>
                    <Option value="团队成员可见">团队成员可见</Option>
                    <Option value="公开">公开</Option>
                </Select>
            </Form.Item>
            <Form.Item label="资料名" name="contentName" rules={[{ required: true, message: "请填写资料名" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="资料简述" name="contentDes" rules={[{ required: true, message: "请填写资料简述" }]}>
                <Input />
            </Form.Item>
            <Button htmlType="submit" type="primary">提交</Button>
        </Form>
    </Card>
    </>
    );
};
