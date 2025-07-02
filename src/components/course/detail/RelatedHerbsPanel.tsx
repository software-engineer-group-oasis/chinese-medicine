import { Card, List, Avatar, Typography } from 'antd';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function RelatedHerbsPanel({ relatedHerbs }: { relatedHerbs: { name: string; description?: string; image?: string }[] }) {
  if (!relatedHerbs || relatedHerbs.length === 0) return null;
  return (
    // <Card className="mb-6" title="关联药材">
    //   <List
    //     grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
    //     dataSource={relatedHerbs}
    //     renderItem={herb => (
    //       <List.Item>
    //         <Link href={`/herb?name=${herb.name}`}>
    //           <Card hoverable className="text-center">
    //             <div className="mb-2">
    //               <Avatar size={64} src={herb.image || "/images/黄连.jpg"} />
    //             </div>
    //             <Title level={5}>{herb.name}</Title>
    //             <Text type="secondary">{herb.description}</Text>
    //           </Card>
    //         </Link>
    //       </List.Item>
    //     )}
    //   />
    // </Card>
        <Card 
            title={<span><MedicineBoxOutlined className="mr-2" />关联药材</span>}
            className="mb-6"
          >   
      
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
              dataSource={course.relatedHerbs || []}
              renderItem={herb => (
                <List.Item>
                  <Link href={`/herb?name=${herb}`}>
                    <Card hoverable className="text-center">
                      <div className="mb-2">
                        <Avatar size={64} src="/images/黄连.jpg" />
                      </div>
                      <Title level={5}>{herb}</Title>
                    </Card>
                  </Link>
                </List.Item>
              )}
            />
        </Card>
  );
}