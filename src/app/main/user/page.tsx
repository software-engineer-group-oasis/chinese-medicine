// app/main/user/page.tsx
"use client";
import UserCard from "@/components/user/UserCard";
import useAuthStore from "@/store/useAuthStore";

export default function InfoPage() {
  const { user } = useAuthStore();

  return <UserCard user={user} />;
}
