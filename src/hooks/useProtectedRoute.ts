import {useRouter} from "next/navigation";
import {useEffect} from "react";
// import useAuthStore from "@/store/useAuthStore";
import Cookies from 'js-cookie';

export const useProtectedRoute = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    //@ts-ignore
    //const {user, initializeAuth} = useAuthStore();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
        }
    }, [router]);
}