import { Card, List, Avatar, Typography } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function RelatedHerbsPanel({ herbs }: { herbs: any[] }) {
  if (!herbs || herbs.length === 0) return null;
  
  return (
    <Card 
      title={<span><MedicineBoxOutlined className="mr-2" />关联药材</span>}
      className="mb-6"
    >   
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={herbs}
        renderItem={herb => (
          <List.Item>
            <Link href={`/main/herb-resource/${herb.herbId}`}>
              <Card hoverable className="text-center">
                <div className="mb-2">
                  <Avatar size={64} src={herb.herbImageUrl || "/images/黄连.jpg"} />
                </div>
                <Title level={5}>{herb.herbName}</Title>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </Card>

  );
}