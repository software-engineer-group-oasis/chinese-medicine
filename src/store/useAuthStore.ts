import { create } from 'zustand'
import Cookies from 'js-cookie';

const useAuthStore = create((set) => (
    {
        user: null,
        token: null,
        isLoggedIn: false,

        //@ts-ignore
        login: (user, token) => {
            set({ user, token, isLoggedIn: true })
            console.log('user:', user);
            // localStorage.setItem('user', JSON.stringify(user));
            // localStorage.setItem('token', token);
            // 使用 js-cookie 设置 Cookie
            Cookies.set('user', JSON.stringify(user), { expires: 1, path: '/' });
            Cookies.set('token', token, { expires: 1, path: '/' });
        },

        logout: () => {
            set({ user: null, token: null, isLoggedIn: false });
            // localStorage.removeItem('user');
            // localStorage.removeItem('token');
            // 使用 js-cookie 删除 Cookie
            Cookies.remove('user', { path: '/' });
            Cookies.remove('token', { path: '/' });
        },

        initializeAuth: () => {
            // const storedUser = localStorage.getItem('user');
            // const storedToken = localStorage.getItem('token');
            const storedUser = Cookies.get('user');
            const storedToken = Cookies.get('token');
            if (storedUser && storedToken) {
                set({
                    user: JSON.parse(storedUser),
                    token: storedToken,
                    isLoggedIn: true,
                });
            }
        },

        updateUser: (user: object) => {
            set({ user })
            //localStorage.setItem('user', JSON.stringify(user))
            // 更新 Cookie 中的 user
            Cookies.set('user', JSON.stringify(user), { expires: 1, path: '/' });
        }
    }
))

export default useAuthStore;