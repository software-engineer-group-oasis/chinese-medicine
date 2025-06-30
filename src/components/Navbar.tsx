import Link from 'next/link';
import React from 'react';
import useAuthStore from "@/store/useAuthStore";

const NAVBAR_HEIGHT = 60;

const Navbar: React.FC = () => {
    const {user} = useAuthStore();
    return (
        <nav style={{
            //width: '100%',
            //background: 'linear-gradient(90deg, #355C3A 0%, #8C6B2F 100%)',
            color: '#fff',
           // padding: '0 40px',
            height: NAVBAR_HEIGHT,
            display: 'flex',
            // alignItems: 'center',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            // fontFamily: 'STKaiti, KaiTi, serif',
            fontSize: 18,
            letterSpacing: 2,
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
        }} className="w-[100%] px-4 py-2 shadow-slate-400 shadow-md backdrop-blur-xs bg-zinc-50/50">
            <div style={{fontWeight: 'bold', fontSize: 22, marginRight: 40}} className="flex-1 flex gap-2 text-green-500">
                <img src='/images/草药.svg' width={20} />
                <Link href="/main">中药智慧平台</Link>
            </div>
            <div style={{display: 'flex', gap: 32}}>
                <Link href="/main/herb" style={{color: '#000', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500}}>中药百科</Link>
                <Link href="/main/course-resource" style={{color: '#000', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500}}>中药课程资源</Link>
                <Link href="/main/research" style={{color: '#000', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500}}>中药课题研究</Link>
                <Link href="/main/training" style={{color: '#000', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500}}>中药制作培训管理</Link>
                <Link href="/main/evaluation" style={{color: '#000', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500}}>中药质量评价与申报</Link>
                <Link href={'/main/user'} style={{color: '#000', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500}}>用户信息</Link>
            </div>
        </nav>
    );
};

export default Navbar;

// 导出导航栏高度，供全局布局使用
export { NAVBAR_HEIGHT };