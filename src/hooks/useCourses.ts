//课程模块数据请求逻辑集中管理
// import useSWR from 'swr';
import { useEffect, useState } from 'react'
import useAxios from './useAxios';
import type { Course } from '@/constTypes/course';
import axiosInstance from '@/api/config';



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
  //只是为了自己看，下面的报错应为没有给data定义类型，则不管
  type dataType = {
    code: number;
    message: string;
    data: {
      total: number;
      pages: number;
      list: {
        [key: string]: any; //在上面转换
      }
    };
  };
  const { data, loading, error} = useAxios("/herb-teaching-service/courses", "get", null, params );
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);


// useEffect(() => {
//     setIsLoading(true);
//     setIsError(false);

//     console.log('发起课程请求，参数:', params);
//     axiosInstance.get('/herb-teaching-service/courses', { params })
//       .then(res => {
//         if (res.data?.data) {
//           const rawList = res.data.data.list || [];
//           const adaptedCourses = rawList.map(adaptCourseFromServer);
//           setCourses(adaptedCourses);
//           setTotal(res.data.data.total || 0);
//           console.log('获取到的课程数据:', adaptedCourses);
//         } else {
//           console.error('接口格式异常', res);
//           setIsError(true);
//         }
//       })
//       .catch(err => {
//         console.error('获取课程失败:', err);
//         setIsError(true);
//       })
//       .finally(() => setIsLoading(false));
// }, [JSON.stringify(params)]); // 如果 params 是对象，用 stringify 触发更新
  useEffect(() => {
    if(data&&data?.data){
      const rawList = data.data.list || [];
      const adaptedCourses = rawList.map(adaptCourseFromServer);
      setCourses(adaptedCourses);
      setTotal(data.data.total || 0);
      console.log('获取到的课程数据:', adaptedCourses);
    }
  }, [data]);

  return {
    courses,
    total,
    loading,
    error
  }

}
