"use client";

import { Layout, Menu } from "antd";
import {useRouter } from "next/navigation";
import { ReactNode} from "react";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "info", label: "我的信息", path: "/main/user" },
  { key: "favorite", label: "我的收藏", path: "/main/user/favorite-course" },
  { key: "course", label: "我的课程", path: "/main/user/my-courses" },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find((i) => i.key === key);
    if (item) {
      router.push(item.path);
    }
  };

  return (
    <Layout style={{ minHeight: "60vh", background: "#fff" }}>
      <Sider width={180} style={{ background: "#f5f5f5" }}>
        <Menu
          mode="inline"
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Content style={{ padding: "2rem" }}>{children}</Content>
    </Layout>
  );
}
