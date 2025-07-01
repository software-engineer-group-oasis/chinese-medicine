// 登录页面
"use client"
import Login from '@/components/Login';
import useAuthStore from "@/store/useAuthStore";
import {toast, Toaster} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function LoginPage() {
    const router = useRouter()
    //@ts-ignore
    const { login, isLoggedIn, initializeAuth } = useAuthStore();
    useEffect(() => {
        initializeAuth();
        if (isLoggedIn) {
            toast.success('系统自动登录');
            router.push("/main");
        }
    },[])

    const handleSuccess = (user:object, token: string) => {
        console.log("user:", user, "token:", token);
        login(user, token)
        toast.success('登录成功');
        router.push("/main");
    };

    const handleError = (msg: string) => {
        console.error('登录失败:', msg);
    };

    return (
        <div className="h-screen w-full" style={{
            backgroundImage: `url(/images/login-bg.avif)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <div><Toaster/></div>
            <Login onLoginSuccess={handleSuccess} onLoginError={handleError} />
        </div>
    );
}