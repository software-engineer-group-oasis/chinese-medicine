import { useState, useEffect } from 'react';
import { Course } from '@/constTypes/course';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';

export function useFavoriteCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // 获取收藏的课程列表
  const fetchFavoriteCourses = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      // 步骤1: 调用获取收藏课程列表的API
      const response = await axiosInstance.get(`/api/users/${user.id}/favorite-courses`);
      if (response.data.code === 0) {
        setCourses(response.data.data);
      } else {
        throw new Error(response.data.message || '获取收藏课程失败');
      }
    } catch (err) {
      console.error('获取收藏课程失败:', err);
      setError(err instanceof Error ? err.message : '获取收藏课程失败');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // 收藏/取消收藏课程
  const toggleFavorite = async (courseId: number) => {
    if (!user?.id) return;
    
    try {
      // 步骤2: 调用收藏/取消收藏课程的API
      const response = await axiosInstance.post(`/api/users/${user.id}/favorite-courses`, {
        courseId,
        action: courses.some(course => course.courseId === courseId) ? 'unfavorite' : 'favorite'
      });
      
      if (response.data.code === 0) {
        // 更新本地收藏课程列表
        await fetchFavoriteCourses();
        return true;
      } else {
        throw new Error(response.data.message || '操作失败');
      }
    } catch (err) {
      console.error('收藏操作失败:', err);
      throw err;
    }
  };

  // 检查课程是否已收藏
  const isFavorite = (courseId: number) => {
    return courses.some(course => course.courseId === courseId);
  };

  useEffect(() => {
    if (user?.id) {
      fetchFavoriteCourses();
    } else {
      setCourses([]);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    courses,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    refresh: fetchFavoriteCourses
  };
}