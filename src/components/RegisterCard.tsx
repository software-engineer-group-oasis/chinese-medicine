import {Card, Form, Input, Button, message, Select} from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from "next/script";
import useAuthStore from "@/store/useAuthStore";
import {ArrowRightOutlined} from "@ant-design/icons";
import Link from "next/link";

const {Option} = Select;

export default function RegisterCard() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {logout,initializeAuth} = useAuthStore();

    // 腾讯云验证码配置
    const captchaAppId = process.env.NEXT_PUBLIC_TENCENT_CAPTCHA_APPID

    const handleRegister = async (values: any) => {
        setLoading(true);
        try {
            if (typeof TencentCaptcha === 'undefined') {
                setError('验证码加载中，请稍候...');
                setLoading(false);
                return;
            }

            // 初始化验证码
            //@ts-ignore
            const captcha = new TencentCaptcha(captchaAppId, (res) => {
                if (res.ret === 0) {
                    // 验证码通过，继续登录流程
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...values,
                            ticket: res.ticket,
                            randStr: res.randstr,
                        }),
                    })
                        .then(r => r.json())
                        .then(data => {
                            if (data.code === 0) {
                                message.success("注册成功");
                                logout();
                                initializeAuth();
                                router.push("/login");
                            } else {
                                throw new Error(data.message || '注册失败');
                            }
                        })
                        .catch((err) => {
                            setError(err.message || '网络异常');
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    setError('验证码校验失败');
                    setLoading(false);
                }
            });

            captcha.show();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            message.error('注册失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <Card title="中草药智慧平台用户注册" className="w-full max-w-md"
                  extra={
                <img src={'/images/草药.svg'} style={{width: "10rem", height: "auto", aspectRatio: "1"}}/>
                  }
                style = {{
                    backgroundColor: "transparent",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                }}
            >
                {
                    error && <div className={'text-red-500 font-bold'}>{error}</div>
                }
                {
                    loading && <div>加载中...</div>
                }
                <Form
                    form={form}
                    onFinish={handleRegister}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{required: true, message: '请输入用户名'}]}
                    >
                        <Input placeholder="输入用户名"/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true, message: '请输入密码'}]}
                        hasFeedback
                    >
                        <Input.Password placeholder="输入密码"/>
                    </Form.Item>

                    <Form.Item
                        label="确认密码"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {required: true, message: '请确认密码'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="再次输入密码"/>
                    </Form.Item>

                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            {required: true, message: '请输入手机号'},
                            {pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确'}
                        ]}
                    >
                        <Input placeholder="输入手机号"/>
                    </Form.Item>

                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            {required: true, message: '请输入邮箱地址'},
                            {type: 'email', message: '邮箱格式不正确'}
                        ]}
                    >
                        <Input placeholder="输入邮箱"/>
                    </Form.Item>

                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[{required: true, message: '请选择角色'}]}
                    >
                        <Select placeholder={"请选择角色"}>
                            <Option value="学生">学生</Option>
                            <Option value="教师">教师</Option>
                            <Option value="管理员">管理员</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            注册
                        </Button>
                    </Form.Item>
                    <Link href="/login" className={'text-sky-500 hover:underline hover:font-bold'}><ArrowRightOutlined />去登录</Link>
                </Form>
            </Card>
            {/* 加载验证码 SDK */}
            <Script src={process.env.NEXT_PUBLIC_TENCENT_CAPTCHA_URL} />
        </div>
    );
};
