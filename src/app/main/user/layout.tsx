"use client";

import { Layout, Menu } from "antd";
import {useRouter } from "next/navigation";
import { ReactNode} from "react";
import { useMemo } from "react";
import { userPermission } from "@/hooks/usePermission";

const { Sider, Content } = Layout;

// const menuItems = [
//   { key: "info", label: "我的信息", path: "/main/user" },
//   { key: "favorite", label: "我的收藏", path: "/main/user/favorite-course" },
//   { key: "course", label: "我的课程", path: "/main/user/my-courses" },
//   { key: "performance", label: "我的业绩", path: "/main/user/my-performances" }
// ];

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const permission = userPermission();

  // 判断是否有“教师”角色
  const isTeacher = permission?.hasRole('教师');

  // 构建菜单项（动态过滤）
  const menuItems = useMemo(() => {
    const baseItems = [
      { key: "info", label: "我的信息", path: "/main/user" },
      { key: "favorite", label: "我的收藏", path: "/main/user/favorite-course" },
    ];

    if (isTeacher) {
      baseItems.push(
        { key: "course", label: "我的课程", path: "/main/user/my-courses" },
        { key: "performance", label: "我的业绩", path: "/main/user/my-performances" }
      );
    }

    return baseItems;
  }, [isTeacher]);

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
