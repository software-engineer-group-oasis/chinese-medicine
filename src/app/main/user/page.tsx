"use client"
import UserCard from "@/components/UserCard";
import useAuthStore from "@/store/useAuthStore";
import {useEffect, useState} from "react";


export default function UserPage() {
    // @ts-ignore
    const {user, initializeAuth} =  useAuthStore()
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!user) {
            initializeAuth();
        }
        setIsLoading(false);
    }, [user, initializeAuth]);

    if (isLoading) {
        return <div>加载中......</div>
    }
    return (
        <>
        {<UserCard user={user}/>}
        </>
    );
}
