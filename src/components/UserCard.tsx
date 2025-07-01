"use client"
import React, { useState } from 'react';
import {Card, Form, Input, Button, message, List, Typography} from 'antd';
import useAuthStore from "@/store/useAuthStore";
import {useRouter} from "next/navigation";

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
    const handleUpdate = (values: UserInfo) => {
        // 这里可以添加调用API更新用户信息的逻辑
        console.log('更新的用户信息:', values);
        message.success('信息更新成功');
        // 更新本地状态以反映更改
        setUserInfo(values);
    };

    const handleLogout = () => {
        console.log('退出登录')
        logout();
        message.success('退出登录成功');
        router.push('/login');
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
                <Form layout="vertical" initialValues={userInfo} onFinish={handleUpdate}>
                    <Form.Item label="姓名" name="username" rules={[{ required: true, message: '请输入您的姓名!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="电话号码" name="phone" rules={[{ required: true, message: '请输入您的电话号码!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            更新信息
                        </Button>
                    </Form.Item>
                    <Button type={'primary'} onClick={handleLogout}>
                        退出登录
                    </Button>
                </Form>

            </Card>

        </div>
    );
};
