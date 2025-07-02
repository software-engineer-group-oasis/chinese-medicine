"use client"
import React, {useEffect} from "react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import UseAuthStore from "@/store/useAuthStore";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({children}:{children:React.ReactNode}) {
    useProtectedRoute();
    // @ts-ignore
    const {initializeAuth} = UseAuthStore();
    useEffect(() => {
        initializeAuth();
    }, []);
    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader />
            <div className="flex flex-1">
                <AdminSidebar />
                {/* 内容区 */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    )
}