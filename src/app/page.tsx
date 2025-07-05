"use client"

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import Link from "next/link";

export default function Page() {
    // const router = useRouter();
    // useEffect(() => {
    //     setTimeout(() => {
    //         router.push('/login');
    //     }, 1000);
    // }, []);
    return (
        <div className="w-full h-screen">
            <div className="z-999 text-white font-bold fixed top-2 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 items-center">
                <h1 className="font-bold text-5xl">中药智慧平台</h1>
                <div className="flex gap-12">
                    <Link href="/login" className="bg-slate-800/75 px-2 py-1 rounded-md text-2xl hover:bg-slate-900">登录</Link>
                    <Link href="/register" className="bg-slate-800/75 px-2 py-1 rounded-md text-2xl hover:bg-slate-900">注册</Link>
                </div>

            </div>
            <iframe src="https://muguilin.github.io/3D-Earth/" className="h-[100%] w-[100%]"></iframe>
        </div>
    )
}