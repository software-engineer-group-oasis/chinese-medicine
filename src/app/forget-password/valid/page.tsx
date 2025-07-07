"use client"
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Button, Card, Form, Input, message} from "antd";
import axios from "axios";

export default function ForgetPasswordValid() {
    const router = useRouter();
    const params =  useSearchParams();
    const token = params.get("token");
    const [valid, setValid] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const validToken = async ()=> {
        console.log("token:", token);
        const res = await fetch(`${baseUrl}/auth/forget/valid?token=${token}`)
        const data = await res.json();
        console.log("validData:", data);
        if (data.result === true) setValid(true);
        else setValid(false);
    }
    const handleResetPassword = async(values)=> {
        const password = values.password
        try {
            const res = await axios.post(`${baseUrl}/auth/forget/reset/${password}?token=${token}`)
            const data = res.data;
            if (data.code === 0) {
                message.success("修改密码成功，即将前往登录页面")
                router.push("/login");
            } else {
                message.error(data.message)
            }
        } catch (err) {
            console.error(err.message)
            message.error("服务器错误")
        }
    }

    useEffect(() => {
        if (token) {
            validToken()
        }
    }, []);

    return (
        <div>
            {valid ? (
                <div className="w-full h-screen flex justify-center">
                    <div className="w-1/3 mt-40">
                        <Card title={
                            <span className="text-3xl">输入新密码</span>
                        }>
                            <Form onFinish={handleResetPassword} layout="vertical">
                                <Form.Item name="password" label="新密码" rules={[{required:true}]}>
                                    <Input.Password />
                                </Form.Item>
                                <Button type="primary" htmlType="submit">确定</Button>
                            </Form>
                        </Card>
                    </div>


                </div>

            ):(
                <div>链接已失效，请重新提交忘记密码的申请</div>
            )}
        </div>
    )
}