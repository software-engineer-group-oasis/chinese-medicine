//课程模块数据请求逻辑集中管理
// import useSWR from 'swr';
import { useEffect, useState } from 'react'
import useAuthStore from "@/store/useAuthStore";

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
export const useCourses = (params: any) => {
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    axiosInstance.get('/herb-teaching-service/courses', { params })
      .then(res => {
        if (res.data?.data) {
          setCourses(res.data.data.list || []);
          setTotal(res.data.data.total || 0);
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

// useEffect(() => {
//   const token = useAuthStore.getState().token;
//   fetch('http://localhost:8090/herb-teaching-service/courses?page=1&size=10', {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(res => res.json())
//     .then(data => {
//       console.log('fetch 成功获取数据:', data);
//     })
//     .catch(err => {
//       console.error('fetch 请求失败:', err);
//     });
// }, []);

}
