import { Card, Rate, Typography, Statistic, Progress } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import type { Course } from '@/constTypes/course';
const { Text, Title } = Typography;

export default function CourseRatingPanelShow(course : any) {
  return (
        <Card title={<span><StarOutlined className="mr-2 text-yellow-500" />课程评分</span>}>
            <div className="text-center mb-4">
              <Title level={2} className="mb-0 text-yellow-500">{course.rating}</Title>
              <Rate disabled defaultValue={Math.round(course.rating)} className="text-xl" />
              <div className="text-gray-500 mt-1">{course.reviews} 人评价</div>
            </div>
            
            <div>
              {[5, 4, 3, 2, 1].map(star => {
                // 模拟各星级的评价比例
                const percent = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                
                return (
                  <div key={star} className="flex items-center mb-2">
                    <div className="w-8 text-right mr-2">{star}星</div>
                    <Progress 
                      percent={percent} 
                      size="small" 
                      showInfo={false} 
                      strokeColor={star >= 4 ? '#52c41a' : star === 3 ? '#faad14' : '#f5222d'}
                      className="flex-1"
                    />
                    <div className="w-10 text-right">{percent}%</div>
                  </div>
                );
              })}
            </div>
        </Card>
  );
}