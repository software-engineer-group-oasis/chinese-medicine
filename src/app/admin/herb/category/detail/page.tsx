"use client"
import {useSearchParams} from "next/navigation";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import React, {useEffect, useState} from "react";
import axiosInstance from "@/api/config";
import {Form, Input, message} from "antd";
import {Herb} from "@/constTypes/herbs";



export default function AdminHerbCategoryDetailPage() {
    const params =  useSearchParams();
    const name = params.get("name") || "";
    const [loading, setLoading] = useState(false);
    const [herb, setHerb] = useState<Herb>({
        name: "", des: "", id: -1, herbLinkCategoryList: [], image: "", origin: ""
    });
    const [form] = Form.useForm();
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
    }, []);
    return (
        <div>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "中药类别管理", href: "/admin/herb/category"},
                {title: "详细信息", href: `/admin/herb/category/detail?name=${name}`}
            ]} />
            <div>
                <Form form={form} onFinish={(values)=> console.log(values)}>
                    <Form.Item name="origin" label="原产地" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="des" label="描述信息" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    {/*<Form.Item name="origin" label="原产地" rules={[{ required: true }]}>*/}
                    {/*    <Input />*/}
                    {/*</Form.Item>*/}
                </Form>

            </div>
        </div>
    )
}