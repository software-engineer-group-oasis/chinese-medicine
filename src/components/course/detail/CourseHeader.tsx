import { Button, Tag, Typography } from 'antd';
import { ClockCircleOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled, ShareAltOutlined } from '@ant-design/icons';
import type { Course, Category } from '@/constTypes/course';
const { Title, Text } = Typography;
type CourseHeaderProps = {
  course: Course;
  isFavorite: boolean;
  handleFavorite: () => void;
  COURSE_TAGS: Category[];
};
export default function CourseHeader({
  course,
  isFavorite,
  handleFavorite,
  COURSE_TAGS
}: CourseHeaderProps) {
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
          icon={isFavorite ? <StarFilled className="text-yellow-500" /> : <StarOutlined />} 
          onClick={handleFavorite}
        >
          {isFavorite ? '已收藏' : '收藏'}
        </Button>
      </div>
    </div>
  );
}