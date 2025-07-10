//课程模块数据请求逻辑集中管理
//hooks/useCourses.ts
// import useSWR from 'swr';
import { useEffect, useState } from 'react'
import useAxios from './useAxios';
import type { Course } from '@/constTypes/course';
import axiosInstance from '@/api/config';
import useRequest from './useRequest';
import { message } from 'antd';
// import { exp } from 'three/tsl';

//后续可封装 api/course.ts 或 const/api.ts
const COURSE_API = {
  LIST: '/herb-teaching-service/courses',
  DETAIL: (id: number | string) => `/herb-teaching-service/courses/${id}`,
  CREATE: '/herb-teaching-service/courses',
  UPDATE: (id: number | string) => `/herb-teaching-service/courses/${id}`,
  DELETE: (id: number | string) => `/herb-teaching-service/courses/${id}`
};


//数据映射
function adaptCourseFromServer(raw: any): Course {
  console.log('原始课程数据:', raw);
  
  // 查找视频资源
  const videoResource = raw.resources?.find((r: any) => 
    r.courseResourceType === 0 || r.courseResourceTypeName === '视频'
  );
  
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
    // 添加视频URL字段 - 从courseResourceContent获取
    videoUrl: raw.videoUrl || videoResource?.courseResourceContent || '',
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
  const { post, put, del } = useRequest();
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

//提交评分
  const fetchUserRating = async (courseId: number) => {
  const url = `/herb-teaching-service/courses/${courseId}/ratings/user`;
  try {
    const res = await axiosInstance.get(url);
    if (res.data.code === 0) {
      console.log('获取用户评分成功:', res.data);
      return { 
        hasRated: true,
        ratingValue: res.data.rating.ratingValue || 0 // 返回评分值
       }; // 返回评分状态
    } else {
      return { hasRated: false, ratingValue: 0 }; // 没有评分
    }
  } catch (error) {
    console.error('获取用户评分错误:', error);
    // message.error('获取用户评分失败，请稍后重试');
    throw error;
  }
}
//POST（自主获取，不用useAxios）
const submitRating = async (courseId: number, ratingValue: number) => {
 const url = `/herb-teaching-service/courses/${courseId}/ratings`;
 try {
    const payload = {
      ratingValue,
    };
    const response = await axiosInstance.post(url, payload);
    const res = response.data as any;
    if(res.code === 0) {
      console.log('评分提交成功:', res);
      message.success('评分提交成功');
      return res;
    } else {
      throw new Error(res.message || '评分提交失败');
    }
  } catch (error) {
    console.error('评分提交错误:', error);
    message.error('评分提交失败，请稍后重试');
    throw error;
  }
};
//编辑课程
// 新增课程
  const createCourse = async (courseData: any) => {
    try {
      console.log('创建课程，数据:', courseData);
      const response = await axiosInstance.post(COURSE_API.CREATE, courseData);
      const res = response.data as any;
      console.log('创建课程响应:', res);
      
      if (res && res.code === 0) {
        message.success('课程新增成功');
        return res;
      } else {
        throw new Error(res?.message || '课程创建失败');
      }
    } catch (error) {
      console.error('创建课程失败:', error);
      message.error('课程创建失败，请稍后重试');
      throw error;
    }
  };

  // 编辑课程
  const updateCourse = async (id: number | string, courseData: any) => {
    try {
      console.log('更新课程，ID:', id, '数据:', courseData);
      const response = await axiosInstance.put(COURSE_API.UPDATE(id), courseData);
      const res = response.data as any;
      console.log('更新课程响应:', res);
      
      if (res && res.code === 0) {
        message.success('课程更新成功');
        return res;
      } else {
        throw new Error(res?.message || '课程更新失败');
      }
    } catch (error) {
      console.error('更新课程失败:', error);
      message.error('课程更新失败，请稍后重试');
      throw error;
    }
  };
  const deleteCourse = async (id: number | string) => {
    const res = await del(COURSE_API.DELETE(id));
    if (res) message.success('课程删除成功');
    return res;
  };
  const refetchCourses = async () => {
    try {
      const res = await axiosInstance.get(COURSE_API.LIST, { params });
      if (res.data.code === 0) {
        const rawList = res.data.data.list || [];
        const adaptedCourses = rawList.map(adaptCourseFromServer);
        setCourses(adaptedCourses);
        setTotal(res.data.data.total || 0);
        console.log('重新获取课程列表数据:', adaptedCourses);
      }
    } catch (error) {
      console.error('重新获取课程列表错误:', error);
      message.error('获取课程列表失败，请稍后重试');
    }
  };


return {
    course,
    courses,
    total,
    loading,
    error,
    fetchUserRating,
    submitRating,
    createCourse, updateCourse, deleteCourse,
    refetchCourses
}

};





