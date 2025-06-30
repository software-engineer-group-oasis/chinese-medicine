import {useRouter} from "next/navigation";
import {useEffect} from "react";

export const useProtectedRoute = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);
}