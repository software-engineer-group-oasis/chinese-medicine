"use client"

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Page() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    }, []);
    return (
        <>正在重定向到登录页面</>
    )
}