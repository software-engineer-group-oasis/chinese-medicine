// 工作业绩管理布局组件
"use client"
import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, FileSearchOutlined, ExportOutlined,
  SettingOutlined, HistoryOutlined, BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;

export default function PerformanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    if (pathname === '/admin/performance') return ['dashboard'];
    if (pathname.includes('/review')) return ['review'];
    if (pathname.includes('/export')) return ['export'];
    if (pathname.includes('/history')) return ['history'];
    if (pathname.includes('/analysis')) return ['analysis'];
    return ['dashboard'];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link href="/admin/performance">工作业绩概览</Link>
          </Menu.Item>
          <Menu.Item key="review" icon={<FileSearchOutlined />}>
            <Link href="/admin/performance/review">业绩审核</Link>
          </Menu.Item>
          <Menu.Item key="export" icon={<ExportOutlined />}>
            <Link href="/admin/performance/export">业绩导出</Link>
          </Menu.Item>
          <Menu.Item key="analysis" icon={<BarChartOutlined />}>
            <Link href="/admin/performance/analysis">统计分析</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0' }}>
        <Content style={{ margin: 0, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}