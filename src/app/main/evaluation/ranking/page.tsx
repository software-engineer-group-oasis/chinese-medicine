// 中药评价排行榜页面
"use client"

import { useState } from 'react';
import { 
  Card, Row, Col, Table, Typography, Rate, Tag, Tabs, Button, 
  Statistic, Avatar, Select, Radio, Space, Tooltip, Divider
} from 'antd';
import { 
  TrophyOutlined, RiseOutlined, FireOutlined, EnvironmentOutlined,
  LineChartOutlined, BarChartOutlined, InfoCircleOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { mockHerbs, regionRankings } from '@/mock/evaluation';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 路径常量/函数
const HERB_DETAIL_LINK = (name: string) => `/main/herb?id=${name}`;
const EVALUATION_HOME_LINK = '/main/evaluation/herbs';

// 表格列定义
const herbColumns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
    width: 80,
    //@ts-ignore
    render: (text, record) => (
      <div className="flex items-center">
        {text <= 3 ? (
          <Avatar 
            style={{ 
              backgroundColor: text === 1 ? '#f56a00' : text === 2 ? '#7265e6' : '#ffbf00',
              marginRight: '8px'
            }}
          >
            {text}
          </Avatar>
        ) : text}
      </div>
    ),
  },
  {
    title: '中药名称',
    dataIndex: 'name',
    key: 'name',
    //@ts-ignore
    render: (text, record) => (
      <div className="flex items-center">
        <div className="relative w-10 h-10 mr-3">
          <Image 
            src={record.image} 
            alt={text}
            fill
            style={{objectFit: 'cover'}}
            className="rounded-md"
          />
        </div>
        <div>
          <Link href={HERB_DETAIL_LINK(text)}>
            <Text strong>{text}</Text>
          </Link>
          <div>
            <Text type="secondary" italic className="text-xs">{record.latinName}</Text>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 180,
    //@ts-ignore
    render: (score, record) => (
      <div>
        <Rate disabled defaultValue={Math.round(score)} className="text-sm" />
        <Text strong className="ml-2">{score}</Text>
      </div>
    ),
  },
  {
    title: '质量等级',
    dataIndex: 'quality',
    key: 'quality',
    width: 100,
    //@ts-ignore
    render: quality => {
      const color = quality === 'A+' ? '#f56a00' : quality === 'A' ? '#52c41a' : quality === 'B+' ? '#1677ff' : '#faad14';
      return <Tag color={color}>{quality}</Tag>;
    },
  },
  {
    title: '产地',
    dataIndex: 'region',
    key: 'region',
    width: 120,
  },
  {
    title: '功效',
    dataIndex: 'efficacy',
    key: 'efficacy',
    ellipsis: true,
  },
  {
    title: '市场价格',
    key: 'price',
    dataIndex: 'price',
    width: 150,
    //@ts-ignore
    render: (price, record) => (
      <div>
        <Text>¥{price}/kg</Text>
        <Text 
          type={record.priceChange.startsWith('+') ? 'success' : record.priceChange.startsWith('-') ? 'danger' : 'secondary'}
          className="ml-2"
        >
          {record.priceChange}
        </Text>
      </div>
    ),
  },
  {
    title: '市场需求',
    dataIndex: 'demand',
    key: 'demand',
    width: 100,
    //@ts-ignore
    render: demand => {
      const color = demand === '极高' ? '#f5222d' : demand === '高' ? '#fa8c16' : demand === '中高' ? '#faad14' : '#52c41a';
      return <Tag color={color}>{demand}</Tag>;
    },
  },
];

const regionColumns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    //@ts-ignore
    render: (text, record, index) => (
      <div className="flex items-center">
        {index + 1 <= 3 ? (
          <Avatar 
            style={{ 
              backgroundColor: index + 1 === 1 ? '#f56a00' : index + 1 === 2 ? '#7265e6' : '#ffbf00',
              marginRight: '8px'
            }}
          >
            {index + 1}
          </Avatar>
        ) : index + 1}
      </div>
    ),
  },
  {
    title: '产区名称',
    dataIndex: 'region',
    key: 'region',
    //@ts-ignore
    render: (text) => (
      <Text strong>{text}</Text>
    ),
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 180,
    //@ts-ignore
    render: (score) => (
      <div>
        <Rate disabled defaultValue={Math.round(score)} className="text-sm" />
        <Text strong className="ml-2">{score}</Text>
      </div>
    ),
  },
  {
    title: '质量等级',
    dataIndex: 'quality',
    key: 'quality',
    width: 100,
    //@ts-ignore
    render: quality => {
      const color = quality === 'A+' ? '#f56a00' : quality === 'A' ? '#52c41a' : quality === 'B+' ? '#1677ff' : '#faad14';
      return <Tag color={color}>{quality}</Tag>;
    },
  },
  {
    title: '代表药材',
    dataIndex: 'herbs',
    key: 'herbs',
    //@ts-ignore
    render: herbs => (
      <div>
      {/* @ts-ignore */}
        {herbs.map((herb, index) => (
          <Tag key={index} color="blue" className="mr-1">{herb}</Tag>
        ))}
      </div>
    ),
  },
  {
    title: '年产量(吨)',
    dataIndex: 'production',
    key: 'production',
  },
  {
    title: '同比变化',
    dataIndex: 'change',
    key: 'change',
    //@ts-ignore
    render: change => (
      <Text 
        type={change.startsWith('+') ? 'success' : change.startsWith('-') ? 'danger' : 'secondary'}
      >
        {change}
      </Text>
    ),
  },
];

// 图表配置
const getScoreDistributionOption = (): EChartsOption => ({
  title: {
    text: '评分分布',
    left: 'center',
    textStyle: {
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['5分', '4.5-4.9分', '4.0-4.4分', '3.5-3.9分', '3.0-3.4分', '3分以下']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '药材数量',
      type: 'bar',
      barWidth: '60%',
      data: [2, 5, 8, 4, 2, 1],
      itemStyle: {
        color: function(params) {
          const colorList = ['#52c41a', '#91d5ff', '#faad14', '#ffa39e', '#ff7875', '#f5222d'];
          return colorList[params.dataIndex];
        }
      }
    }
  ]
});

const getPriceChangeOption = (): EChartsOption => ({
  title: {
    text: '价格变化趋势',
    left: 'center',
    textStyle: {
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['黄连', '三七', '党参', '当归', '川芎'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} 元/kg'
    }
  },
  series: [
    {
      name: '黄连',
      type: 'line',
      data: [260, 265, 270, 275, 278, 280],
      itemStyle: { color: '#f56a00' }
    },
    {
      name: '三七',
      type: 'line',
      data: [320, 325, 330, 335, 340, 350],
      itemStyle: { color: '#722ed1' }
    },
    {
      name: '党参',
      type: 'line',
      data: [115, 116, 118, 119, 120, 120],
      itemStyle: { color: '#52c41a' }
    },
    {
      name: '当归',
      type: 'line',
      data: [140, 142, 145, 148, 150, 150],
      itemStyle: { color: '#1677ff' }
    },
    {
      name: '川芎',
      type: 'line',
      data: [82, 83, 84, 84, 85, 85],
      itemStyle: { color: '#faad14' }
    }
  ]
});

export default function RankingPage() {
  const [rankingType, setRankingType] = useState('herb');
  const [timeRange, setTimeRange] = useState('month');
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href={EVALUATION_HOME_LINK}>
          <Button icon={<ArrowLeftOutlined />}>返回评价主页</Button>
        </Link>
      </div>
      
      <Title level={2} className="mb-6">中药材评价排行榜</Title>
      
      <Card className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="参与评价药材" 
              value={mockHerbs.length} 
              prefix={<TrophyOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="优质药材数量" 
              value={mockHerbs.filter(h => h.quality === 'A+' || h.quality === 'A').length} 
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="高需求药材" 
              value={mockHerbs.filter(h => h.demand === '高' || h.demand === '极高').length} 
              prefix={<FireOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="优质产区数量" 
              value={regionRankings.filter(r => r.quality === 'A+' || r.quality === 'A').length} 
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>
      
      <Card className="mb-6">
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><BarChartOutlined />评分分布</span>}
            key="1"
          >
            <ReactECharts option={getScoreDistributionOption()} style={{ height: '300px' }} />
          </TabPane>
          <TabPane 
            tab={<span><LineChartOutlined />价格趋势</span>}
            key="2"
          >
            <div className="mb-4 text-right">
              <Radio.Group value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                <Radio.Button value="month">近6个月</Radio.Button>
                <Radio.Button value="year">近1年</Radio.Button>
                <Radio.Button value="years">近3年</Radio.Button>
              </Radio.Group>
            </div>
            <ReactECharts option={getPriceChangeOption()} style={{ height: '300px' }} />
          </TabPane>
        </Tabs>
      </Card>
      
      <Card 
        title={
          <div className="flex justify-between items-center">
            <Space>
              <TrophyOutlined />
              <span>排行榜</span>
              <Tooltip title="排行榜数据每周更新一次，基于用户评价和市场数据">
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
            <Radio.Group value={rankingType} onChange={e => setRankingType(e.target.value)}>
              <Radio.Button value="herb">中药材排行</Radio.Button>
              <Radio.Button value="region">产区排行</Radio.Button>
            </Radio.Group>
          </div>
        }
      >
        {rankingType === 'herb' ? (
          <Table 
            columns={herbColumns} 
            dataSource={mockHerbs} 
            rowKey="id" 
            pagination={false}
          />
        ) : (
          <Table 
            columns={regionColumns} 
            dataSource={regionRankings} 
            rowKey="region" 
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
}