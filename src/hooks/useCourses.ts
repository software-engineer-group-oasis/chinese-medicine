//课程模块数据请求逻辑集中管理
// import useSWR from 'swr';
import { useEffect, useState } from 'react'
import useAuthStore from "@/store/useAuthStore";
import type { Course } from '@/constTypes/course';
import axiosInstance from '@/api/config';

// const fetcher = (url: string, params: any) => axiosInstance.get(url, { params }).then(res => {
//   console.log('课程模块 Fetched data:', res.data);
//   return res.data;
// });

// export const useCourses = (params: any) => {
//   console.log('useCourses params:', params); 
//   const { data, error } = useSWR(['/herb-teaching-service/courses', params], ([url, params]) => fetcher(url, params));
//   return {
//     courses: data?.data?.list || [],
//     total: data?.data?.total || 0,
//     isLoading: !error && !data,
//     isError: error
//   };
// };
// export const useCourseById = (courseId: number) => {
//   const { data, error } = useSWR(`/herb-teaching-service/courses/${courseId}`, url => axiosInstance.get(url).then(res => res.data));
//   return {
//     course: data || null,
//     isLoading: !error && !data,
//     isError: error
//   };
// };

//数据映射
function adaptCourseFromServer(raw: any): Course {
  console.log('原始课程数据:', raw);
  
  // 确保类型字段是字符串
  const adaptedCourse = {
    courseId: raw.courseId,
    courseName: raw.courseName,
    coverImageUrl: raw.coverImageUrl || 'https://example.com/default-cover.jpg',
    courseType: String(raw.courseTypeName || '未分类'),
    courseObject: String(raw.courseObjectName || '通用'),
    teacherId: raw.teacherId,
    courseStartTime: raw.courseStartTime || '',
    courseEndTime: raw.courseEndTime || '',
    courseDes: raw.courseDes || '',
    courseAverageRating: Number(raw.courseAverageRating || 0),
    courseRatingCount: Number(raw.courseRatingCount || 0),
  };
  
  console.log('适配后的课程数据:', adaptedCourse);
  return adaptedCourse;
}

export const useCourses = (params: any) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    console.log('发起课程请求，参数:', params);
    axiosInstance.get('/herb-teaching-service/courses', { params })
      .then(res => {
        if (res.data?.data) {
          const rawList = res.data.data.list || [];
          const adaptedCourses = rawList.map(adaptCourseFromServer);
          setCourses(adaptedCourses);
          setTotal(res.data.data.total || 0);
          console.log('获取到的课程数据:', adaptedCourses);
        } else {
          console.error('接口格式异常', res);
          setIsError(true);
        }
      })
      .catch(err => {
        console.error('获取课程失败:', err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [JSON.stringify(params)]); // 如果 params 是对象，用 stringify 触发更新

  return {
    courses,
    total,
    isLoading,
    isError
  }

}
