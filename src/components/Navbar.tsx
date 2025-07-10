"use client"
import Link from 'next/link';
import React from 'react';
import useAuthStore from "@/store/useAuthStore";
import SearchHerb from "@/components/SearchHerb";
import {usePathname} from "next/navigation";


const NAVBAR_HEIGHT = 60;

const Navbar: React.FC = () => {
//@ts-ignore
    const {user} = useAuthStore();
    const path = usePathname();
    // 只在非herb页面保留背景
    const showBg = !path.startsWith('/main/herb');
    return (
        <div style={showBg ? {width: "100%", height: "40vh", backgroundImage: "url(/images/banner02-1.jpg)", backgroundSize:"cover", backgroundPosition: "top"} : {}}>
            <nav className="flex items-center  w-9/10 rounded-lg px-6 py-3 bg-gray-100/75 backdrop-blur-md fixed left-1/2 top-4 transform -translate-x-1/2 z-100">
                <div style={{fontWeight: 'bold', fontSize: 22, marginRight: 40}} className="flex-1 flex gap-2 text-green-800">
                    <img src='/images/草药.svg' width={20} />
                    <Link href="/main">中药智慧平台</Link>
                </div>
                <div style={{display: 'flex', gap: 32}}>
                    <Link href="/main/herb" className="link">中药百科</Link>
                    <Link href="/main/course-resource" className="link">中药课程资源</Link>
                    <Link href="/main/research" className="link">中药课题研究</Link>
                    <Link href="/main/training" className="link">中药制作培训材料</Link>
                    <Link href="/main/evaluation" className="link">中药质量评价与申报</Link>
                    <Link href={'/main/user'} className="link">用户信息</Link>
                </div>
            </nav>
            {
                path === '/main' &&
                <div className="absolute left-1/2 top-40 z-999 transform -translate-x-1/2 w-1/2">
                    <SearchHerb />
                </div>
            }
            <style jsx>{
                `
                .link-my {
                    color: #000;
                    text-decoration: none;
                    transition: color 0.2s ease-in;
                }
                .link:hover {
                    color: #8bc34a;
                }
                `
            }</style>
        </div>
    );
};

export default Navbar;

// 导出导航栏高度，供全局布局使用
export { NAVBAR_HEIGHT };