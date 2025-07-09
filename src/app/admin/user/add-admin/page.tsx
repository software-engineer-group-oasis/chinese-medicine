"use client"

import axiosInstance from "@/api/config";
import { User } from "@/constTypes/user";
import { Button, Card, Form, Input, message, Table } from "antd"
import { useEffect, useState } from "react"
import { userColumns as columns } from "@/constTypes/user";

export default function AdminAddAdminPage() {
    const [admins, setAdmins] = useState<User[]>([]);
    const fetchAdmin = async() => {
        try {
           const res = await axiosInstance.get("/his-user-service/root/user/category/管理员");
           const data = res.data;
           if (data.code === 0) {
                setAdmins(data.users);
           }
           else {
            throw new Error(data.message)
           }
        } catch (err) {
            console.error(err.message)
            message.error(err.message)
        }
    }

    const addAdmin = async (values)=> {
        console.log(values);
        try {
            const res = await axiosInstance.post("/his-user-service/root/admin", values);
           const data = res.data;
           if (data.code === 0) {
                fetchAdmin()
           }
           else {
            throw new Error(data.message)
           }
        } catch (e) {
            console.error(err.message)
            message.error(err.message)
        }
    }

    useEffect(()=> {
        fetchAdmin();
    }, [])
    return (
    <div>
        <Card title={<div className="font-bold text-3xl">添加管理员</div>}>
            <Form layout="vertical" onFinish={addAdmin}>
                <Form.Item name="username" label="用户名" rules={[{required:true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" hidden initialValue={123}>
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="电话" rules={[{required:true}]}>
                    <Input />
                </Form.Item>
                {/* TODO 验证邮箱格式 */}
                <Form.Item name="email" label="邮件" rules={[{required:true}]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">提交</Button>
                </Form.Item>
            </Form>
        </Card>
        <Card title={<div className="font-bold text-3xl">管理员列表</div>}>
            <Table dataSource={admins} columns={columns}/>
        </Card>
    </div>
    )
}