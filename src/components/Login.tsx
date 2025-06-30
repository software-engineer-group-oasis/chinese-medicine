"use client"

import Script from 'next/script';
import { useState, useCallback } from 'react';
import { Input, Button } from "antd";
import { UserOutlined,  LockOutlined} from '@ant-design/icons';

interface LoginProps {
    onLoginSuccess?: (user:object, token: string) => void;
    onLoginError?: (message: string) => void;
}

const Login = ({ onLoginSuccess, onLoginError }: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 腾讯云验证码配置
    const captchaAppId = process.env.NEXT_PUBLIC_TENCENT_CAPTCHA_APPID

    const handleLogin = useCallback(() => {
        // 使用 useCallback 包裹登录处理逻辑，确保该函数在整个组件生命周期内具有稳定的引用地址。
        // 这样做主要是为了优化性能，尤其是在依赖该函数作为 props 传递给子组件或用于 useEffect 等场景时，
        // 避免因函数频繁重新创建而导致不
        //必要的重渲染或副作用执行。
        // 此处依赖数组为 [username, password]，表示当 username 或 password 变化时，函数内部会使用最新的值。
        if (!username || !password) {
            setError('请输入用户名和密码');
            return;
        }

        setError('');
        setLoading(true);

        // 模拟调用验证码
        // TencentCaptcha 使用通过script 标签引入的
        //@ts-ignore
        if (typeof TencentCaptcha === 'undefined') {
            setError('验证码加载中，请稍候...');
            setLoading(false);
            return;
        }

        // 初始化验证码
        //@ts-ignore
        const captcha = new TencentCaptcha(captchaAppId, (res) => {
            if (res.ret === 0) {
                // 验证码通过，继续登录流程
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username,
                        password,
                        ticket: res.ticket,
                        randStr: res.randstr,
                    }),
                })
                    .then(r => r.json())
                    .then(data => {
                        if (data.code === 0) {
                            console.log('data', data)
                            onLoginSuccess?.(data.user, data.token);
                        } else {
                            throw new Error(data.message || '登录失败');
                        }
                    })
                    .catch((err) => {
                        setError(err.message || '网络异常');
                        onLoginError?.(err.message || '登录失败');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setError('验证码校验失败');
                setLoading(false);
            }
        });

        captcha.show();
    }, [username, password]);

    return (
            <div className="w-fit h-fit flex flex-col gap-4 py-6 px-10 bg-slate-400/30 rounded-2xl shadow-2xl backdrop-blur-sm"
                 style={{
                     position: "absolute",
                     left: "50rem",
                     top: "5rem"
            }}>
                <header className="flex justify-between">
                    <div><img src="/images/草药.svg" alt="logo" width={50} /></div>
                    <p>中草药信息系统登录</p>
                </header>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <Input size="large" placeholder="用户名" prefix={<UserOutlined />}
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       disabled={loading}
                />
                <Input size="large" prefix={<LockOutlined />}
                       type="password"
                       placeholder="密码"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       disabled={loading}
                />
                <Button onClick={handleLogin} disabled={loading}>
                    {loading ? '验证中...' : '登录'}
                </Button>

                {/* 加载验证码 SDK */}
                <Script src={process.env.NEXT_PUBLIC_TENCENT_CAPTCHA_URL} />
            </div>
    );
};

export default Login;