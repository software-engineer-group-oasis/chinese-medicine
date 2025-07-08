"use client"
import {useSearchParams} from "next/navigation";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import React, {useEffect, useState} from "react";
import axiosInstance from "@/api/config";
import {Button, Form, Input, message, UploadProps} from "antd";
import {Herb} from "@/constTypes/herbs";
import { Upload } from "antd";
import {UploadOutlined} from "@ant-design/icons";
import useAxios from "@/hooks/useAxios";


export default function AdminHerbCategoryDetailPage() {
    const params =  useSearchParams();
    const name = params.get("name") || "";
    const id = params.get("id") || "";
    const [loading, setLoading] = useState(false);
    const [herb, setHerb] = useState<Herb>({
        name: "", des: "", id: -1, herbLinkCategoryList: [], image: "", origin: ""
    });
    const [imageUrl, setImageUrl] = useState("");
    const [form] = Form.useForm();

    const props: UploadProps = {
        accept: "image/*",
        maxCount: 1,
        name: 'upload-file',
        action: '/api/tencent-cos',
        headers: {
            contentType: "multipart/form-data"
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

    const {data:herbData, loading:herbLoading} = useAxios(`/herb-info-service/herbs/info/${name}`)

    const updateHerbInfo = (values)=> {
        axiosInstance.put(`/herb-info-service/herbs/info/${id}`, {
            name: name,
            origin: values.origin,
            img_url: imageUrl,
            des: values.des
        })
            .then(res => {
                if (res.data.code === 0) {
                    message.success("数据更新成功")
                } else throw new Error(res.data.message ||"数据更新失败")
            })
            .catch(err => {
                message.error(err.message);
                console.error(err.message);
            })
    }

    useEffect(() => {
        if (herbData && herbData.code === 0) {
            setHerb(herbData.herb)
            setImageUrl(herbData.herb.image)
            form.setFieldsValue(herbData.herb)
        }
    }, [name, id, herbData]);

    useEffect(() => {
        axiosInstance.get(`/herb-info-service/herbs/info/${name}`)
            .then(res => {
                //console.log(res.data)
                if (res.data.code === 0) {
                    setHerb(res.data.herb)

                } else {
                    throw new Error(res.data.message || "API请求错误")
                }
            })
            .catch(error => {
                console.error(error.message)
                message.error(error.message)
            })
            .finally(()=> {
                setLoading(false);
            })
    }, [form, name]);

    if (herbLoading) return <div>加载中...</div>

    return (
        <div>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "中药类别管理", href: "/admin/herb/category"},
                {title: "详细信息", href: `/admin/herb/category/detail?name=${name}`}
            ]} />
            <div className="w-4/5 border-2 border-slate-500 p-4 rounded-md mt-2">
                <h1 className="font-bold text-3xl p-2">{name}</h1>
                <div className="my-2">
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>点击上传图片进行修改</Button>
                    </Upload>
                    {/*  preview  */}
                    {
                        imageUrl &&
                        <img src={imageUrl} width="50rem" alt='preview' className="aspect-square object-cover overflow-auto"/>
                    }
                </div>

                <Form form={form} onFinish={updateHerbInfo} initialValues={herb} layout="vertical">
                    <Form.Item name="origin" label="原产地" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="des" label="描述信息" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}