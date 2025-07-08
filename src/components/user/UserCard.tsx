"use client"
import React, { useState } from 'react';
import {Card, Form, Input, Button, message, List, Typography, Avatar} from 'antd';
import useAuthStore from "@/store/useAuthStore";
import {useRouter} from "next/navigation";
import axiosInstance from "@/api/config";
import Link from "next/link";

const {Text} = Typography;

// 定义用户信息类型
type UserInfo = {
    id: number;
    username: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
    role: string;
}

export default function UserCard ({user}: {user: UserInfo}): React.ReactNode {
    const router = useRouter();
    const {updateUser} = useAuthStore();
    // 初始化用户信息
    const [userInfo, setUserInfo] = useState<UserInfo>({
        id: user?.id,
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        avatarUrl: user?.avatarUrl,
        role: user?.role
    });

    const {logout} = useAuthStore();

    // 处理表单提交
    const handleUpdate = () => {
        // 这里可以添加调用API更新用户信息的逻辑
        console.log('更新的用户信息:', userInfo);
        axiosInstance.put("/his-user-service/account/info/me",
            {
                userId: userInfo.id,
                phone: userInfo.phone,
                email: userInfo.email,
                avatarUrl: userInfo.avatarUrl
            })
            .then(res => {
                if (res.data.code === 0) {
                    console.log(res.data.user);
                    message.success('信息更新成功');
                    updateUser(res.data.user);
                    setUserInfo(res.data.user);
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(error => {
                message.error('信息更新失败');
                console.error("信息更新失败:", error.message)
            })
    };

    const handleLogout = () => {
        console.log('退出登录')
        logout();
        message.success('退出登录成功');
        router.push('/login');
    }

    // 处理头像上传
    const [uploading, setUploading] = useState(false);
    const handleFileChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('upload-file', file);
        fetch('/api/tencent-cos', {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 'success') {
                    const uploadedUrl = result.url;
                    setUserInfo((prev) => ({
                        ...prev,
                        avatarUrl: uploadedUrl
                    }));

                }
            })
            .catch(error => {
                message.error("上传失败"+error.message);
            })
            .finally(()=> {
                setUploading(false);
            })
    }



    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
            <Card title="用户信息" variant={'outlined'}>
                <List
                    size={'small'}
                    dataSource={[
                        {label: '用户类型', value: userInfo.role}
                    ]}
                    renderItem={(item)=> (
                        <List.Item>
                            <Text strong>{item.label}: <span className={'ml-2'}>{item.value}</span></Text>
                        </List.Item>
                    )}
                />
                <List
                    size={'small'}
                    dataSource={[
                        {label: '用户名', value: userInfo.username}
                    ]}
                    renderItem={(item)=> (
                        <List.Item>
                            <Text strong>{item.label}: <span className={'ml-2'}>{item.value}</span></Text>
                        </List.Item>
                    )}
                />
                <Form layout="vertical" initialValues={userInfo} onFinish={handleUpdate}>
                    <Form.Item label="头像" name="avatarUrl">
                        <div>
                            {/*通过label实现点击选择文件*/}
                            <label htmlFor={'avatar-upload'} className={'cursor-pointer'}>
                                <Avatar
                                    src={userInfo.avatarUrl ? userInfo.avatarUrl : '/images/avatar.png'}
                                    alt={'用户头像'}
                                />
                            </label>
                        </div>
                        <input
                            id={'avatar-upload'}
                            type={'file'}
                            onChange={handleFileChange}
                            accept={"/image/*"}
                            hidden
                        />
                    </Form.Item>
                    {
                        uploading &&
                        <div>图片上传中...</div>
                    }
                    {
                        userInfo.avatarUrl &&
                        <a href={userInfo.avatarUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:underline ml-4"
                        >{userInfo.avatarUrl}</a>
                    }

                    <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="电话号码" name="phone" rules={[{ required: true, message: '请输入您的电话号码!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <div className={"flex gap-2"}>
                            <Button type="primary" htmlType="submit">
                                更新信息
                            </Button>
                            <Button type={'primary'} onClick={handleLogout}>
                                退出登录
                            </Button>
                        </div>

                    </Form.Item>

                </Form>

            </Card>

        </div>
    );
};
