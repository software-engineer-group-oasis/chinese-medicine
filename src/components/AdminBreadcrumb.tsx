import Breadcrumb from 'antd/es/breadcrumb';
import Link from 'next/link';
import { ReactNode } from 'react';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

export interface AdminBreadcrumbItem {
  title: ReactNode;
  href?: string;
  icon?: ReactNode;
}

interface AdminBreadcrumbProps {
  items: AdminBreadcrumbItem[];
  className?: string;
}

export default function AdminBreadcrumb({ items, className }: AdminBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <Breadcrumb.Item>
        <Link href="/admin"><HomeOutlined /> 首页</Link>
      </Breadcrumb.Item>
      {items.map((item, idx) => (
        <Breadcrumb.Item key={idx}>
          {item.href ? (
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          ) : (
            <>
              {item.icon}
              {item.title}
            </>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
} 