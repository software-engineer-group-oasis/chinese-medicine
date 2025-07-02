import { Card, List, Button, Progress, Empty, Typography } from 'antd';
import { ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import type { LearningProgressPanelProps } from '@/constTypes/course';
const { Text } = Typography;

export default function LearningProgressPanel({ learningCourses }
    : LearningProgressPanelProps) {
  return (
    <Card
      title={
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-2" />
          <span>学习进度</span>
        </div>
      }
      className="mb-6"
    >
      {learningCourses.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={learningCourses}
          renderItem={item => (
            <List.Item>
              <div className="w-full">
                <div className="flex items-start mb-2">
                  <div className="relative w-16 h-12 mr-2 flex-shrink-0">
                    <Image
                      src={item.cover || "/default-cover.png"}
                      alt={item.title || "课程封面"}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/course-resource/${item.id}?t=${item.lastPosition}`}>
                      <Text strong ellipsis>{item.title}</Text>
                    </Link>
                    <div className="text-xs text-gray-500">
                      <ClockCircleOutlined className="mr-1" />
                      {item.lastViewedAt}
                    </div>
                  </div>
                </div>
                <Progress
                  percent={item.progress}
                  size="small"
                  status="active"
                  strokeColor="#52c41a"
                />
                <div className="mt-1 text-right">
                  <Link href={`/course-resource/${item.id}?t=${item.lastPosition}`}>
                    <Button type="link" size="small" className="p-0">
                      继续学习 <RightOutlined />
                    </Button>
                  </Link>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无学习记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <div className="mt-4 text-center">
        <Link href="/user/learning-center">
          <Button type="primary">查看全部学习记录</Button>
        </Link>
      </div>
    </Card>
  );
}