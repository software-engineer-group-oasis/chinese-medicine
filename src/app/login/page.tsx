// 登录页面
"use client"
import Login from '@/components/Login';

export default function LoginPage() {
    const handleSuccess = (token: string) => {
        alert('登录成功！');
        // 可以跳转页面或保存 token
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
            <Login onLoginSuccess={handleSuccess} onLoginError={handleError} />
        </div>
    );
}