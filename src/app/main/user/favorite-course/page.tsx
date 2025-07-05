"use client"
import { useEffect } from "react";
import CourseList from "@/components/course/CourseList";
import useAuthStore from "@/store/useAuthStore";
import { Empty, Spin } from "antd";
import { useFavoriteCourses } from "@/hooks/useFavoriteCourses";

export default function FavoriteCoursePage() {
  const { courses, loading, error } = useFavoriteCourses();
  const { user } = useAuthStore();

  if (loading) {
    return <div className="flex justify-center items-center h-[200px]"><Spin /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-[200px] text-red-500">{error}</div>;
  }

  if (!user) {
    return <Empty description="请先登录" />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
      <CourseList courses={courses} />
    </div>
  );
}