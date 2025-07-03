"use client"

import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import Link from "next/link";
import {useEffect} from "react";
import axiosInstance from "@/api/config";

export default function HerbPage() {
  useEffect(() => {
    axiosInstance.get("/herb-info-service/herbs")
        .then(res => {
          console.log(res.data)
        })
  }, []);
  return (
      <div>
        <AdminBreadcrumb className="mb-4" items={[
          { title: '中药信息管理' }
        ]} />
        {/* 页面内容 */}
        {/*<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>*/}
        {/*  中药信息管理模块（药材、分类、地理、成长记录等）*/}
        {/*</div>*/}
        {/*<Link href="/admin/herb/test">地理信息管理</Link>*/}
      </div>
  );
}