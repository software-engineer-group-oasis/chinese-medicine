"use client"
import React from 'react';
import AdminBreadcrumb from "@/components/AdminBreadcrumb";

export default function AdminHerbCategoryPage() {
    return (
        <>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "中药类别管理"}
            ]} />
            <div>中药类别管理</div>
        </>
    );
}