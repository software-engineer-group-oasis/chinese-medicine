"use client"
import React from "react";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    useProtectedRoute();
    return (
        <>{children}</>
    );
}
