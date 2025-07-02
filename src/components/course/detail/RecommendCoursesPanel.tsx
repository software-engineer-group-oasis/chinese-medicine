import { Card, List, Typography, Avatar } from 'antd';
import Link from 'next/link';

const { Text } = Typography;

export default function RecommendCoursesPanel({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) return null;
  return (
    // <Card className="mb-6" title="推荐课程">
    //   <List
    //     itemLayout="horizontal"
    //     dataSource={courses}
    //     renderItem={item => (
    //       <List.Item>
    //         <List.Item.Meta
    //           avatar={<Avatar src={item.cover} />}
    //           title={<Link href={`/course-resource/${item.id}`}>{item.title}</Link>}
    //           description={item.description}
    //         />
    //       </List.Item>
    //     )}
    //   />
    // </Card>
              <Card 
            title={<span><FireOutlined className="mr-2 text-red-500" />相关课程推荐</span>}
            className="mb-6"
          >
            <List
              itemLayout="horizontal"
              dataSource={mockCourses.filter(c => c.id !== courseId).slice(0, 3)}
              renderItem={item => (
                <List.Item>
                  <Link href={`/course-resource/${item.id}`} className="w-full">
                    <div className="flex">
                      <div className="relative w-20 h-12 mr-2 flex-shrink-0">
                        <Image 
                          src={item.cover} 
                          alt={item.title}
                          fill
                          sizes="80px"
                          priority
                          style={{objectFit: 'cover'}}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <Text strong ellipsis>{item.title}</Text>
                        <div>
                          <Rate disabled defaultValue={Math.round(item.rating)} className="text-xs" />
                          <Text className="text-xs ml-1">{item.rating}</Text>
                        </div>
                      </div>
                    </div>
                  </Link>
                </List.Item>
              )}
            />
            <div className="mt-4 text-center">
              <Link href="/course-resource">
                <Button type="link">查看更多课程</Button>
              </Link>
            </div>
          </Card>
  );
}