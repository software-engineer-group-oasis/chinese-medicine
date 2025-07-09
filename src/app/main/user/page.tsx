// app/main/user/page.tsx
"use client";
import UserCard from "@/components/user/UserCard";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

export default function InfoPage() {
  const { user, initializeAuth } = useAuthStore();
  useEffect(()=> {
    if (!user) {
      initializeAuth();
    }
  }, [])
  return <UserCard user={user} />;
}
