"use client"
import React, {useEffect} from "react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";
import UseAuthStore from "@/store/useAuthStore";
import Navbar, {NAVBAR_HEIGHT} from "@/components/Navbar";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    useProtectedRoute();
    // @ts-ignore
    const {initializeAuth} = UseAuthStore();
    useEffect(() => {
        initializeAuth();
    }, []);
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: NAVBAR_HEIGHT }}>
                {children}
            </div>
        </>
    );
}
