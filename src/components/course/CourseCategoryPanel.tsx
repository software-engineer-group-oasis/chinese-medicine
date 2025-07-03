import { Card, List, Typography } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { CourseCategoryPanelProps } from '@/constTypes/course';

const { Text } = Typography;


export default function CourseCategoryPanel({ courses, COURSE_CATEGORIES, COURSE_TARGETS }
: CourseCategoryPanelProps) {
  return (
    <Card
      title={
        <div className="flex items-center">
          <BookOutlined className="mr-2" />
          <span>课程分类</span>
        </div>
      }
    >
      <List
        size="small"
        dataSource={[
          { title: '全部课程', count: courses.length, link: '/main/course-resource' },
          ...COURSE_CATEGORIES.filter(c => c.value !== 'all').map(c => {
            const count = courses.filter(course => course.courseType === c.value).length;
            console.log(`类别 ${c.label} 匹配课程数:`, count);
            return {
              title: `${c.label}课程`,
              count,
              link: `/main/course-resource?category=${c.value}`,
            };
          }),
          ...COURSE_TARGETS.filter(t => t.value !== 'all').map(t => {
            const count = courses.filter(course => course.courseObject === t.value).length;
            console.log(`对象 ${t.label} 匹配课程数:`, count);
            return {
              title: `${t.label}课程`,
              count,
              link: `/main/course-resource?target=${t.value}`,
            };
          }),
        ]}
        renderItem={item => (
          <List.Item>
            <Link href={item.link} className="w-full flex justify-between">
              <Text>{item.title}</Text>
              <Text type="secondary">{item.count}</Text>
            </Link>
          </List.Item>
        )}
      />
    </Card>
  );
}