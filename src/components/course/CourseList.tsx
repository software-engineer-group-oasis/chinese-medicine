//课程展示
import { Row, Col, Card, Tag, Typography, Rate, Progress, Empty } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { COURSE_TAGS } from '@/constants/course';
import type { Course } from '@/constTypes/course';
const { Title, Paragraph, Text } = Typography;

type CourseListProps = {
  courses: Course[];
}
export default function CourseList({ courses }: CourseListProps) {
  if (!courses || courses.length === 0) return <Empty description="未找到相关课程" />;
  return (
    <Row gutter={[16, 16]}>
      {courses.map(course => {
        return (
          <Col xs={24} sm={12} md={8} key={course.courseId}>
            <Link href={`/main/course-resource/${course.courseId}`}>
              <Card
                hoverable
                className="h-full"
                cover={
                  <div className="relative pt-[56.25%] bg-gray-100">
                    <Image
                      src={course.coverImageUrl}
                      alt={course.courseName}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {course.courseStartTime} - {course.courseEndTime || '进行中'}
                    </div>
                  </div>
                }
              >
                <div>
                  <Title level={5} className="mb-1" ellipsis={{ rows: 1 }}>
                    {course.courseName}
                  </Title>
                  <div className="mb-2">
                    {/* 课程类型标签 */}
                    <Tag
                      key={course.courseType}
                      color={COURSE_TAGS.find(t => t.value === course.courseType)?.color || 'default'}
                    >
                      {course.courseType}
                    </Tag>
                    
                    {/* 课程对象标签 */}
                    <Tag
                      key={course.courseObject}
                      color={COURSE_TAGS.find(t => t.value === course.courseObject)?.color || 'blue'}
                    >
                      {course.courseObject}
                    </Tag>
                  </div>
                  <Paragraph ellipsis={{ rows: 2 }} className="text-gray-500 mb-2">
                    {course.courseDes}
                  </Paragraph>
                  <div className="flex justify-between items-center">
                    <div>
                      <Rate disabled defaultValue={Math.round(course.courseRatingCount)} className="text-xs" />
                      <Text className="ml-1 text-xs">{course.courseRatingCount}</Text>
                    </div>
                    {/* <div>
                      <Text className="text-xs">{course.likes}</Text>
                    </div> */}
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
}