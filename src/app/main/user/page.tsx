"use client"
import UserCard from "@/components/user/UserCard";
import useAuthStore from "@/store/useAuthStore";
import {useEffect, useState} from "react";
import {Layout, Menu} from "antd";
import {useRouter} from "next/navigation";

const {Sider, Content} = Layout;

export default function UserPage() {
    // @ts-ignore
    const {user, initializeAuth} = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState("info");
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            initializeAuth();
        }
        setIsLoading(false);
    }, [user, initializeAuth]);

    if (isLoading) {
        return <div>加载中......</div>
    }

    const handleMenuClick = (e: any) => {
        setSelectedKey(e.key);
        if (e.key === "favorite") {
            router.push("/main/user/favorite-course");
        }
        if (e.key === "info") {
            router.push("/main/user");
        }
    };

    return (
        <Layout style={{minHeight: "60vh", background: "#fff"}}>
            <Sider width={180} style={{background: "#f5f5f5"}}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    style={{height: "100%", borderRight: 0}}
                >
                    <Menu.Item key="info">我的信息</Menu.Item>
                    <Menu.Item key="favorite">我的收藏</Menu.Item>
                </Menu>
            </Sider>
            <Content style={{padding: "2rem"}}>
                {selectedKey === "info" && <UserCard user={user}/>} 
                
            </Content>
        </Layout>
    );
}
