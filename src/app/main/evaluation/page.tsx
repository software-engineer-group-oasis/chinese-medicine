// 中药评价模块主页面
"use client"

import { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Input, Button, Statistic, Divider, Tag, List, 
  Typography, Rate, Badge, Avatar, Tooltip, Empty, Tabs
} from 'antd';
import { 
  SearchOutlined, FireOutlined, TrophyOutlined, RiseOutlined, 
  StarOutlined, EnvironmentOutlined, HeartOutlined, LikeOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { mockHerbs, regionRankings } from '@/mock/evaluation';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 链接常量/函数
const getHerbDetailLink = (name: string) => `/main/herb?id=${name}`;
const RANKING_LINK = '/main/evaluation/ranking';
const REGION_RANKING_LINK = '/main/evaluation/region-ranking';
const DEMAND_RANKING_LINK = '/main/evaluation/demand-ranking';
const APPLICATION_LINK = '/main/evaluation/application';

export default function HerbEvaluationPage() {
  const [searchText, setSearchText] = useState('');
  const [filteredHerbs, setFilteredHerbs] = useState(mockHerbs);
  
  // 搜索功能
  useEffect(() => {
    if (searchText) {
      const filtered = mockHerbs.filter(herb => 
        herb.name.includes(searchText) || 
        herb.latinName.toLowerCase().includes(searchText.toLowerCase()) ||
        herb.efficacy.includes(searchText) ||
        herb.region.includes(searchText)
      );
      setFilteredHerbs(filtered);
    } else {
      setFilteredHerbs(mockHerbs);
    }
  }, [searchText]);

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">中药材评价系统</Title>
      
      {/* 搜索栏 */}
      <div className="mb-8">
        <Input.Search
          placeholder="搜索中药名称、功效或产地..."
          enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-3xl"
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧中药展示区域 */}
        <Col xs={24} lg={16}>
          <Title level={4} className="mb-4">
            <StarOutlined className="mr-2" />中药材评价展示
          </Title>
          
          {filteredHerbs.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredHerbs.map(herb => (
                <Col xs={24} sm={12} key={herb.id}>
                  <Link href={getHerbDetailLink(herb.name)} className="block">
                    <Card 
                      hoverable 
                      className="h-full"
                      cover={
                        <div className="p-4 bg-gray-50 flex justify-center">
                          <div className="relative w-32 h-32">
                            <Image 
                              src={herb.image} 
                              alt={herb.name}
                              fill
                              style={{objectFit: 'cover'}}
                              className="rounded-lg"
                            />
                          </div>
                        </div>
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Title level={4} className="mb-0">{herb.name}</Title>
                          <Text type="secondary" italic>{herb.latinName}</Text>
                        </div>
                        <Badge count={`No.${herb.rank}`} style={{ backgroundColor: '#52c41a' }} />
                      </div>
                      
                      <div className="mb-2">
                        <Rate disabled defaultValue={Math.round(herb.score)} className="text-sm" />
                        <Text strong className="ml-2">{herb.score}</Text>
                        <Text type="secondary" className="ml-2">({herb.reviews}次评价)</Text>
                      </div>
                      
                      <Paragraph ellipsis={{ rows: 2 }} className="mb-2">
                        <Text strong>功效：</Text>{herb.efficacy}
                      </Paragraph>
                      
                      <div className="flex items-center mb-2">
                        <EnvironmentOutlined className="mr-1 text-blue-500" />
                        <Text>{herb.region}</Text>
                        <Text type="secondary" className="ml-2">¥{herb.price}/kg</Text>
                        <Text 
                          type={herb.priceChange.startsWith('+') ? 'success' : 'danger'}
                          className="ml-1"
                        >
                          {herb.priceChange}
                        </Text>
                      </div>
                      
                      <div>
                        {herb.tags.map(tag => (
                          <Tag key={tag} color={tag === '名贵' ? 'gold' : tag === '热销' ? 'red' : 'blue'} className="mr-1">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="未找到相关中药材" />
          )}
        </Col>
        
        {/* 右侧排行榜区域 */}
        <Col xs={24} lg={8}>
          <Card className="mb-6">
            <Tabs defaultActiveKey="1">
              <TabPane 
                tab={<span><TrophyOutlined />优质中药排行</span>}
                key="1"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={mockHerbs.slice(0, 5)}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: index === 0 ? '#f56a00' : index === 1 ? '#7265e6' : index === 2 ? '#ffbf00' : '#00a2ae' 
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        }
                        title={
                          <Link href={getHerbDetailLink(item.name)}>
                            {item.name}
                            <Rate disabled defaultValue={Math.round(item.score)} className="text-xs ml-2" />
                          </Link>
                        }
                        description={
                          <div>
                            <Text type="secondary">{item.region}</Text>
                            <div>
                              <Tag color="blue">{item.efficacy.split('、')[0]}</Tag>
                              <Tag color="green">评分 {item.score}</Tag>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className="text-right mt-2">
                  <Link href={RANKING_LINK}>
                    <Button type="link">查看完整排行 &gt;</Button>
                  </Link>
                </div>
              </TabPane>
              
              <TabPane 
                tab={<span><EnvironmentOutlined />优质产区排行</span>}
                key="2"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={regionRankings}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: index === 0 ? '#f56a00' : index === 1 ? '#7265e6' : index === 2 ? '#ffbf00' : '#00a2ae' 
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        }
                        title={
                          <span>
                            {item.region}
                            <Rate disabled defaultValue={Math.round(item.score)} className="text-xs ml-2" />
                          </span>
                        }
                        description={
                          <div>
                            <Text type="secondary">代表药材：</Text>
                            {item.herbs.map((herb, i) => (
                              <Tag key={i} color="blue">{herb}</Tag>
                            ))}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className="text-right mt-2">
                  <Link href={REGION_RANKING_LINK}>
                    <Button type="link">查看完整排行 &gt;</Button>
                  </Link>
                </div>
              </TabPane>
              
              <TabPane 
                tab={<span><FireOutlined />热门需求排行</span>}
                key="3"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={mockHerbs.sort((a, b) => {
                    const demandOrder = { '极高': 5, '高': 4, '中高': 3, '中': 2, '低': 1 };
                    return demandOrder[b.demand] - demandOrder[a.demand];
                  }).slice(0, 5)}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: index === 0 ? '#f56a00' : index === 1 ? '#7265e6' : index === 2 ? '#ffbf00' : '#00a2ae' 
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        }
                        title={
                          <Link href={`/main/herb?id=${item.name}`}>
                            {item.name}
                            <Tag color="red" className="ml-2">需求{item.demand}</Tag>
                          </Link>
                        }
                        description={
                          <div>
                            <Text type="secondary">{item.region}</Text>
                            <div className="flex items-center">
                              <Text>¥{item.price}/kg</Text>
                              <Text 
                                type={item.priceChange.startsWith('+') ? 'success' : 'danger'}
                                className="ml-1"
                              >
                                {item.priceChange}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className="text-right mt-2">
                  <Link href={DEMAND_RANKING_LINK}>
                    <Button type="link">查看完整排行 &gt;</Button>
                  </Link>
                </div>
              </TabPane>
            </Tabs>
          </Card>
          
          {/* 申报入口 */}
          <Card 
            title={<span><RiseOutlined className="mr-2" />中药材申报入口</span>}
            className="mb-6"
          >
            <Paragraph>
              通过我们的评价系统，您可以为优质中药材申请评级认证，提升产品价值和市场竞争力。
            </Paragraph>
            <div className="text-center mt-4">
              <Link href={APPLICATION_LINK}>
                <Button type="primary" size="large">
                  进入申报系统
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}