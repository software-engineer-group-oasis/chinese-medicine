import { Card, Row, Col, Divider, Statistic, Typography, Descriptions, Avatar } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { mockCourses } from '@/mock/courseResource';
import { Course } from '@/constTypes/course';
import { COURSE_TARGETS } from '@/constants/course';
const { Title, Paragraph, Text } = Typography;

export default function CourseInfoPanel(course : Course) {
  return (
    <Card 
            title={<span><InfoCircleOutlined className="mr-2" />课程信息</span>}
            className="mb-6"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Title level={4} className="mb-4">课程简介</Title>
                <Paragraph>{course.courseDes}</Paragraph>
                
                <Divider />
                
                <Descriptions title="基本信息" column={{ xs: 1, sm: 2, md: 3 }}>
                  <Descriptions.Item label="创建时间">{course.courseStartTime}</Descriptions.Item>
                  <Descriptions.Item label="课程时长">{course.courseEndTime} - {course.courseStartTime}</Descriptions.Item>
                  <Descriptions.Item label="适用对象">
                    {COURSE_TARGETS
                      .filter(target => String(course.courseObject).includes(target.value))
                      .map(target => target.label)
                      .join('、') || '无'}
                  </Descriptions.Item>
                  <Descriptions.Item label="课程类别">{course.courseType}</Descriptions.Item>
                  {/* <Descriptions.Item label="观看次数">{course.viewCount}</Descriptions.Item>
                  <Descriptions.Item label="下载次数">{course.downloadCount}</Descriptions.Item> */}
                </Descriptions>
              </Col>
              
              <Col xs={24} md={8}>
                <Card className="bg-gray-50">
                  <div className="flex items-center mb-4">
                    <Avatar src={course.authorAvatar} size={64} className="mr-4" />
                    <div>
                      <Title level={5} className="mb-0">{course.author}</Title>
                      <Text type="secondary">{course.authorTitle}</Text>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Statistic title="课程数" value={mockCourses.filter(c => c.author === course.author).length} />
                    <Statistic title="评分" value={course.rating} suffix="/5" />
                  </div>
                </Card>
              </Col>
            </Row>
    </Card>
  );
}