import { Button, Tag, Typography,message  } from 'antd';
import { ClockCircleOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled, ShareAltOutlined } from '@ant-design/icons';
import type { Course, Category } from '@/constTypes/course';
import { collect } from 'echarts/types/src/component/axisPointer/modelHelper.js';
import { useState,useEffect , } from 'react';
import { useFavoriteCourses } from '@/hooks/useFavoriteCourses';
const { Title, Text } = Typography;

 
type CourseHeaderProps = {
  course: Course;
  // collected: boolean;
  // handleFavorite: () => void;
  COURSE_TAGS: Category[];
};

export default function CourseHeader({
  course,
  // collected,
  // handleFavorite,
  COURSE_TAGS
}: CourseHeaderProps) {
  const { isFavorite, addFavorite, removeFavorite, fetchFavoriteCourses } = useFavoriteCourses();
  const [collected, setCollected] = useState(false);
  // 初始加载：根据收藏状态设定按钮初始值
  useEffect(() => {
    const check = async () => {
      const hasCollected = await isFavorite(course.courseId); // 你这可能是个函数，也可能是直接从收藏列表判断
      setCollected(hasCollected);
    };
    check();
  }, [course.courseId]);
  //收藏处理
  const handleFavorite = async () => {
    try {
      if (collected) {
        await removeFavorite(course.courseId);
        message.success('已取消收藏');
        setCollected(false);
      } else {
        await addFavorite(course.courseId);
        message.success('已收藏到我的课程');
        setCollected(true);
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
    await fetchFavoriteCourses();
    console.log(`收藏状态: ${collected ? '未收藏' : '已收藏'}`);
  };
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <Title level={2} className="mb-2">{course.courseName}</Title>
        <div>
          <Tag color="blue">
            {COURSE_TAGS.find(t => t.value === course.courseType)?.label || course.courseType}
          </Tag>
          <Tag color="green">
            {COURSE_TAGS.find(t => t.value === course.courseObject)?.label || course.courseObject}
          </Tag>
          <Text type="secondary" className="ml-2">
            <ClockCircleOutlined className="mr-1" />
            {course.courseStartTime} - {course.courseEndTime || '进行中'}
          </Text>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          icon={collected ? <StarFilled className="text-yellow-500" /> : <StarOutlined />} 
          onClick={handleFavorite}
        >
          {collected ? '已收藏' : '收藏'}
        </Button>
      </div>
    </div>
  );
}