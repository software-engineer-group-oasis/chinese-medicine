import { NextRequest, NextResponse } from 'next/server';
import axiosInstance from '@/api/config';

// 获取用户收藏的课程列表
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // 步骤1: 从数据库获取用户收藏的课程ID列表
    const favoritesResponse = await axiosInstance.get(`/his-course-service/favorites/${params.userId}`);
    if (favoritesResponse.data.code !== 0) {
      throw new Error(favoritesResponse.data.message || '获取收藏列表失败');
    }

    // 步骤2: 获取收藏课程的详细信息
    const courseIds = favoritesResponse.data.data;
    const coursesResponse = await axiosInstance.post('/his-course-service/courses/batch', { courseIds });
    if (coursesResponse.data.code !== 0) {
      throw new Error(coursesResponse.data.message || '获取课程信息失败');
    }

    return NextResponse.json({
      code: 0,
      message: 'success',
      data: coursesResponse.data.data
    });
  } catch (error) {
    console.error('获取收藏课程失败:', error);
    return NextResponse.json({
      code: -1,
      message: error instanceof Error ? error.message : '获取收藏课程失败',
      data: null
    }, { status: 500 });
  }
}

// 收藏/取消收藏课程
export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await request.json();
    const { courseId, action } = body;

    // 步骤3: 调用收藏/取消收藏API
    const response = await axiosInstance.post(`/his-course-service/favorites/${params.userId}`, {
      courseId,
      action
    });

    if (response.data.code !== 0) {
      throw new Error(response.data.message || '操作失败');
    }

    return NextResponse.json({
      code: 0,
      message: action === 'favorite' ? '收藏成功' : '取消收藏成功',
      data: null
    });
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json({
      code: -1,
      message: error instanceof Error ? error.message : '操作失败',
      data: null
    }, { status: 500 });
  }
}