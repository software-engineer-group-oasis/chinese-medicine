"use client"
import AdminBreadcrumb from "@/components/AdminBreadcrumb";

export default function AdminGrowthPage() {
    return (
        <>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "成长溯源信息"}
            ]} />
            <div>成长溯源信息</div>
        </>

    )
}