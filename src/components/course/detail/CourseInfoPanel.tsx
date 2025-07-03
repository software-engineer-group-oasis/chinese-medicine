import { Card, Row, Col, Divider, Statistic, Typography, Descriptions, Avatar } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { mockCourses } from '@/mock/courseResource';
import { Course } from '@/constTypes/course';
import { COURSE_TARGETS } from '@/constants/course';
import { AnyARecord } from 'node:dns';
const { Title, Paragraph, Text } = Typography;


export default function CourseInfoPanel({ course }: { course: any }) {
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
                  <Descriptions.Item label="开始时间">{course.courseStartTime}</Descriptions.Item>
                  <Descriptions.Item label="结束时间">{course.courseEndTime || '进行中'}</Descriptions.Item>
                  <Descriptions.Item label="适用对象">{course.courseObject}</Descriptions.Item>
                  <Descriptions.Item label="课程类别">{course.courseType}</Descriptions.Item>
                  <Descriptions.Item label="讲师">{course.author || '未知'}</Descriptions.Item>
                  <Descriptions.Item label="评分">{course.rating || 0}/5 ({course.courseRatingCount || 0}人评价)</Descriptions.Item>
                </Descriptions>
              </Col>
              
              <Col xs={24} md={8}>
                <Card className="bg-gray-50">
                  <div className="flex items-center mb-4">
                    <Avatar src={course.authorAvatar} size={64} className="mr-4" />
                    <div>
                      <Title level={5} className="mb-0">{course.author || '未知讲师'}</Title>
                      <Text type="secondary">{course.authorTitle || '讲师'}</Text>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Statistic title="课程ID" value={course.courseId} />
                    <Statistic title="评分" value={course.rating || 0} suffix="/5" />
                  </div>
                </Card>
              </Col>
            </Row>
    </Card>
  );
}