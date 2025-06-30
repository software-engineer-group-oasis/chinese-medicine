import {create} from 'zustand'

const useAuthStore = create((set) => (
    {
        user: null,
        token: null,
        isLoggedIn: false,

        //@ts-ignore
        login: (user, token) => {
            set({user, token, isLoggedIn: true})
            console.log('user:', user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        },

        logout: () => {
            set({ user: null, token: null, isLoggedIn: false });
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },

        initializeAuth: () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (storedUser && storedToken) {
                set({
                    user: JSON.parse(storedUser),
                    token: storedToken,
                    isLoggedIn: true,
                });
            }
        }
    }
))

export default useAuthStore;