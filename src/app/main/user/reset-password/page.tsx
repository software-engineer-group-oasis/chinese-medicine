"use client"
import {Button, Form, Input, message} from "antd";
import React, {useEffect, useState} from "react";
import axiosInstance from "@/api/config";
import useAuthStore from "@/store/useAuthStore";

type ResetPasswordFormData = {
    username:string,
    oldPassword:string,
    newPassword:string,
}

const ResetPasswordPage: React.FC  = () => {
//@ts-ignore
    const {user, initializeAuth} = useAuthStore();
    if (!user) {
        initializeAuth();
    }
    console.log(user);
    const userInfo = {
        username: user.username,
        oldPassword: "",
        newPassword: ""
    }

    const handleResetPassword = (value:ResetPasswordFormData)=> {
        axiosInstance.post("/his-user-service/account/password/reset", value)
            .then(res => {
                if (res.data.code === 0) {
                    message.success("重置密码成功")
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(error => {
                message.error("重置密码失败")
                console.error(error);
            })
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">修改密码</h2>
                    <Form
                        initialValues={userInfo}
                        layout="vertical"
                        onFinish={handleResetPassword}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '请输入用户名!' }]}
                        >
                            <Input placeholder="请输入用户名" />
                        </Form.Item>

                        <Form.Item
                            label="旧密码"
                            name="oldPassword"
                            rules={[{ required: true, message: '请输入旧密码!' }]}
                        >
                            <Input.Password placeholder="请输入旧密码" />
                        </Form.Item>

                        <Form.Item
                            label="新密码"
                            name="newPassword"
                            rules={[
                                { required: true, message: '请输入新密码!' },
                                { min: 6, message: '新密码长度至少为6位' }
                            ]}
                        >
                            <Input.Password placeholder="请输入新密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={false}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default ResetPasswordPage;