"use client"
import {Button, Card, Form, Input, message} from "antd";
import axios from "axios";

export default function ForgetPassword() {
    const [form] = Form.useForm();

//@ts-ignore
    const handleForgetPassword = async (values)=> {
        console.log(values);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/forget/send`, values)
            const data = res.data;
            console.log(data);
            if (data.code === 0) {
                message.success("重置密码请求已经提交，请及时查看邮箱")
            } else message.error("提交请求失败："+data.message)
        } catch (e) {
            message.error("服务器错误")
        }

    }


    return (
        <>
            <div className="h-screen w-full">
                <div className="w-[100%] flex justify-center">
                    <Card className="bg-white min-w-[300px] w-1/3 top-40"
                          title={
                              <span className="text-2xl">重置密码申请</span>
                          }
                    >
                        <Form form={form} layout="vertical" onFinish={handleForgetPassword}>
                            <Form.Item label="用户名" name="username"  rules={[{required: true, message: "请填写用户名"}]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="邮箱" name="email" rules={[{required: true, message: "请填写邮箱"}]}>
                                <Input />
                            </Form.Item>
                            <Button htmlType="submit" type="primary">提交</Button>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    )
}