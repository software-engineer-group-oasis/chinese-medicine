import { useState, useEffect } from 'react';
import { Course } from '@/constTypes/course';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';

export function useFavoriteCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //@ts-ignore
  const { user } = useAuthStore();

  // 获取收藏的课程列表
  const fetchFavoriteCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/herb-teaching-service/courses/collections', {
        params: {
          pageNum: 1,
          pageSize: 10
        }
      });
      if (response.data.code === 0) {
        setCourses(response.data.data.list || []);
      } else {
        throw new Error(response.data.message || '获取收藏课程失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取收藏课程失败');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // 判断课程是否已收藏
  const checkFavorite = async (courseId: number) => {
    try {
      const response = await axiosInstance.get(`/herb-teaching-service/courses/${courseId}/collections/user`);
      if (response.data.code === 0) {
        return response.data.hasCollected;
      }
      return false;
    } catch {
      return false;
    }
  };

  // 添加收藏
  const addFavorite = async (courseId: number) => {
    try {
      const response = await axiosInstance.post(`/herb-teaching-service/courses/${courseId}/collections`);
      if (response.data.code === 0) {
        await fetchFavoriteCourses();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
 // 移除收藏
  const removeFavorite = async (courseId: number) => {
    try {
      const response = await axiosInstance.delete(`/herb-teaching-service/courses/${courseId}/collections`);
      if (response.data.code === 0) {
        await fetchFavoriteCourses(); // 更新收藏列表
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // 本地判断是否已收藏
  const isFavorite = (courseId: number) => {
    return courses.some(course => course.courseId === courseId);
  };

  useEffect(() => {
    fetchFavoriteCourses();
  }, [user?.id]);

  return {
    courses,
    loading,
    error,
    fetchFavoriteCourses,
    addFavorite,
    removeFavorite,
    checkFavorite,
    isFavorite
  };
}