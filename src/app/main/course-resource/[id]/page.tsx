// 中药课程资源详情页面
"use client"

import { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tabs, message} from 'antd';
import { CommentOutlined} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import CommentSection from '@/components/CommentSection';
import CourseTabs from '@/components/course/detail/CourseTabs';
import CourseInfoPanel from '@/components/course/detail/CourseInfoPanel';
import RelatedHerbsPanel from '@/components/course/detail/RelatedHerbsPanel';
import ResourceDownloadPanel from '@/components/course/detail/ResourceDownloadPanel';
import CourseRatingPanel from '@/components/course/detail/CourseRatingPanel'; 
import RecommendCoursesPanel from '@/components/course/detail/RecommendCoursesPanel';
import CourseHeader from '@/components/course/detail/CourseHeader';
import { mockCourses, mockVideoProgress } from '@/mock/courseResource';
const { Title} = Typography;

// 格式化时间（秒转为时:分:秒）
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

// 解析时间字符串为秒数
const parseTimeToSeconds = (timeStr: string) => {
  if (!timeStr) return 0;
  
  const parts = timeStr.split(':').map(part => parseInt(part, 10));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = parseInt(params.id, 10);
  const course = mockCourses.find(c => c.id === courseId);
  
  const [activeTab, setActiveTab] = useState('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [quality, setQuality] = useState('720p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 初始化视频播放位置
  useEffect(() => {
    if (!course) return;
    
    // 从URL参数获取时间点
    const timeParam = searchParams.get('t');
    let startTime = 0;
    
    if (timeParam) {
      // 如果URL中有时间参数，优先使用
      startTime = parseTimeToSeconds(timeParam);
    } else if (mockVideoProgress[courseId as keyof typeof mockVideoProgress]) {
      // 否则使用保存的进度
      startTime = mockVideoProgress[courseId as keyof typeof mockVideoProgress];
    }
    
    // 设置视频开始时间
    if (videoRef.current && startTime > 0) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  }, [courseId, searchParams]);
  
  // 视频事件处理
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };
  
  const handleQualityChange = (quality: string) => {
    setQuality(quality);
    message.success(`已切换到${quality}画质`);
    // 实际项目中这里需要切换视频源
  };
  
  const handleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    message.success(isLiked ? '已取消点赞' : '已点赞');
  };
  
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? '已取消收藏' : '已收藏到我的课程');
  };
  
  const handleDownload = (resource: any) => {
    message.success(`开始下载: ${resource.name}`);
    // 实际项目中这里需要处理文件下载逻辑
  };
  
  const handleShare = () => {
    // 复制当前页面链接
    navigator.clipboard.writeText(window.location.href);
    message.success('链接已复制，可以分享给他人');
  };
  
  if (!course) {
    return (
      <div className="p-6 pt-20 text-center">
        <Title level={4}>课程不存在</Title>
        <Button type="primary" onClick={() => router.push('/course-resource')}>
          <ArrowLeftOutlined /> 返回课程列表
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20">
      {/* 返回按钮 */}
      <div className="mb-4">
        <Button type="link" onClick={() => router.push('/course-resource')} className="pl-0">
          <ArrowLeftOutlined /> 返回课程列表
        </Button>
      </div>
      
      {/* 课程标题 */}
      <CourseHeader
        course={course}
        isLiked={false}
        isFavorite={false}
        handleLike={() => {}}
        handleFavorite={() => {}}
        handleShare={() => {}}
        COURSE_TAGS={[]} // 传你的标签常量
      />

      
      <Row gutter={[24, 24]}>
        {/* 左侧课程内容 */}
        <Col xs={24} lg={18}>
          {/* 内容展示区 */}
          <CourseTabs
            course={course}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            videoProps={{
              videoPlayer: (
                <video src={course.videoUrl} controls width="100%" />
              )
            }}
            handleDownload={handleDownload}
          />
          
          {/* 课程信息 */}
          <CourseInfoPanel course={course} />
          
          {/* 关联药材 */}
          <RelatedHerbsPanel relatedHerbs={course.relatedHerbs} />

          {/* 资源下载 */}
          <ResourceDownloadPanel resources={course.resources || []} onDownload={handleDownload} />
          {/* 评论区 */}
          <Card 
            title={<span><CommentOutlined className="mr-2" />评论区</span>}
            className="mb-6"
          >
            <CommentSection />
          </Card>
        </Col>
        
        {/* 右侧推荐课程与评分 */}
        <Col xs={24} lg={6}>
            {/* 课程推荐 */}
            <CourseRatingPanel rating={course.rating} reviews={course.reviews} />
            {/* 课程评分 */}
            <RecommendCoursesPanel courses={recommendCourses} />

        </Col>
      </Row>
    </div>
  );
}