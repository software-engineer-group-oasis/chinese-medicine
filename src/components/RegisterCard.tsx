import {Card, Form, Input, Button, message, Select} from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from "next/script";
import useAuthStore from "@/store/useAuthStore";
import {ArrowRightOutlined} from "@ant-design/icons";
import Link from "next/link";
import {devNull} from "node:os";
import axiosInstance from "@/api/config";
import axios from 'axios';

const {Option} = Select;

const SchoolFields = () => {
    return (
        <>
            <Form.Item
                label="学校名称"
                name="schoolName"
                rules={[{required: true, message: '请输入学校名称'}]}
            >
                <Input placeholder="输入学校名称"/>
            </Form.Item>

            <Form.Item
                label="真实姓名"
                name="userName"
                rules={[{required: true, message: '请输入真实姓名'}]}
            >
                <Input placeholder="输入真实姓名"/>
            </Form.Item>

            <Form.Item
                label="邀请码"
                name="invitationCode"
                rules={[{required: true, message: '请输入邀请码'}]}
            >
                <Input placeholder="输入邀请码"/>
            </Form.Item>
        </>
    );
};

export default function RegisterCard() {
    const [role, setRole] = useState('普通用户');
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {logout,initializeAuth} = useAuthStore();
    const [emailSent, setEmailSent] = useState(false);

    useEffect(()=> {
        if (emailSent === true) {
            setTimeout(()=> {
                setEmailSent(false);
            }, 500)
        }
    }, [emailSent])

    const handleRoleChange = (value:string)=> {
        setRole(value)
        if (value !== "学生" && value !== "教师") {
            form.setFieldsValue({
                schoolName: null,
                userName: null,
                invitationCode: null,
            })
        }
    }

    // 发送邮箱验证码
    const sendEmailCode = async () => {
        try {
            const values = await form.validateFields(['email']);
            const email = values.email;
            console.log("email:", email);

            if (!email) {
                message.error('请先输入邮箱地址');
                return;
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register/verify/email/${email}`)
            const data = res.data;
            console.log("邮箱验证:", data);
            if (data.code === 0) {
                message.success('验证码已发送至您的邮箱');
                setEmailSent(true);
            } else if (data.code === -1) {
                message.error('该邮箱已被使用');
            } else {
                message.error('发送验证码失败');
            }
        } catch (err) {
            console.error(err.message)
            message.error('网络异常，请稍后再试');
        }
    };

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
                    // 验证码通过
                    const apiUrl = role === '学生' || role === '老师'
                        ? '/auth/register/school'
                        : '/auth/register';
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${apiUrl}`, {
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
                            message.error(err.message)
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
        <>
            <style jsx>{`
                .wave {
                    display: inline-block;
                    font-size: 60px;
                    animation: wave-animation 2s cubic-bezier(0.4, 0.1, 0.35, 1) infinite;
                    transform-origin: bottom center;
                }

                @keyframes wave-animation {
                    0%   { transform: rotate(0deg); }
                    15%  { transform: rotate(14deg); }
                    30%  { transform: rotate(-7deg); }
                    45%  { transform: rotate(9deg); }
                    60%  { transform: rotate(-4deg); }
                    75%  { transform: rotate(2deg); }
                    90%  { transform: rotate(0deg); }
                    100% { transform: rotate(0deg); }
                }
            `}</style>
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <Card title={
                    <span className="text-gradient text-3xl font-bold whitespace-pre-line">中草药智慧平台{'\n'}用户注册</span>
                } className="w-full max-w-md"
                      extra={
                          <img className="wave" src={'/images/草药.svg'} style={{width: "10rem", height: "auto", aspectRatio: "1"}}/>
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
                        requiredMark={true}
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

                        {/* 获取验证码按钮 */}
                        <Form.Item label="验证码">
                            <div className="flex gap-2">
                                <Form.Item
                                    name="emailVerifyCode"
                                    noStyle
                                    rules={[{ required: true, message: '请输入验证码' }]}
                                >
                                    <Input placeholder="输入验证码" />
                                </Form.Item>
                                <Button
                                    type="default"
                                    onClick={sendEmailCode}
                                    disabled={emailSent}
                                    loading={loading}
                                >
                                    {emailSent ? '已发送' : '获取验证码'}
                                </Button>
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="角色"
                            name="role"
                            rules={[{required: true, message: '请选择角色'}]}
                        >
                            <Select placeholder={"请选择角色"} onChange={handleRoleChange} value={role}>
                                <Option value="普通用户">普通用户</Option>
                                <Option value="学生">学生</Option>
                                <Option value="教师">教师</Option>
                            </Select>
                        </Form.Item>
                        {(role === '学生' || role === '教师') && <SchoolFields />}

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
        </>

    );
};
