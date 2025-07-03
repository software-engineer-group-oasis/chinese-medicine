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
    //课程详细新增
    labs: raw.labs || [],
    resources: raw.resources || [],
    herbs: raw.herbs || [],
    // 添加额外字段用于UI显示
    author: raw.teacherName || '',
    authorAvatar: raw.teacherAvatar || '',
    authorTitle: '讲师',
    rating: Number(raw.courseAverageRating || 0),
    viewCount: 0,
    downloadCount: 0
  };
  
  console.log('适配后的课程数据:', adaptedCourse);
  return adaptedCourse;
}

  //只是为了自己看，下面的报错应为没有给data定义类型，则不管
type dataType = {
    code: number;
    message: string;
    data: {
      total: number;
      pages: number;
      list: {
        [key: string]: any; //在上面转换
        labs?: any[];
        resources?: any[];
        herbs?: any[];
      }
    };
};
type UseCoursesOptions = {
  id?: string | number;       // 获取某个课程详情
  params?: Record<string, any>; // 获取课程列表的参数
};
export const useCourses = ({ id, params }: UseCoursesOptions) => {
  const isDetail = !!id;
  const url = isDetail
    ? `/herb-teaching-service/courses/${id}`
    : `/herb-teaching-service/courses`;

  const { data, loading, error} = useAxios(url, "get", null, isDetail ? null : params );
  const [course, setCourse] = useState<Course>();//单个
  const [labs, setLabs] = useState<any[]>([]);//实验
  const [herbs, setHerbs] = useState<any[]>([]);//草药
  const [resources, setResources] = useState<any[]>([]);//资源
  
  const [courses, setCourses] = useState<Course[]>([]);//列表
  const [total, setTotal] = useState(0);


useEffect(() => {
    if(data&&data?.data){
      if (isDetail) {
        // 处理单个课程详情
        const adaptedCourse = adaptCourseFromServer(data.data);
        setCourse(adaptedCourse);
        console.log('获取到的单个课程详情:', adaptedCourse);
      } else {
        //处理课程列表
      const rawList = data.data.list || [];
      const adaptedCourses = rawList.map(adaptCourseFromServer);
      setCourses(adaptedCourses);
      setTotal(data.data.total || 0);
      console.log('获取到的课程列表数据:', adaptedCourses);
      }
    }
  }, [data]);

return {
    course,
    courses,
    total,
    loading,
    error
}

}
