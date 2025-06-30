"use client"
import React, {useEffect} from "react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import UseAuthStore from "@/store/useAuthStore";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    useProtectedRoute();
    // @ts-ignore
    const {initializeAuth} = UseAuthStore();
    useEffect(() => {
        initializeAuth();
    }, []);
    return (
        <>{children}</>
    );
}
