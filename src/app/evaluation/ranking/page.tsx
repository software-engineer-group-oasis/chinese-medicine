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

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 模拟中药数据
const mockHerbs = [
  {
    id: 1,
    name: '黄连',
    latinName: 'Coptis chinensis',
    image: '/images/黄连.jpg',
    score: 4.8,
    rank: 1,
    region: '重庆石柱',
    efficacy: '清热燥湿、泻火解毒',
    usage: '治疗湿热腹泻、心烦口渴、目赤肿痛等症',
    feature: '重庆最著名的道地药材之一',
    price: 280,
    priceChange: '+5%',
    demand: '高',
    reviews: 128,
    quality: 'A+',
    tags: ['道地药材', '名贵', '热销']
  },
  {
    id: 2,
    name: '党参',
    latinName: 'Codonopsis pilosula',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.6,
    rank: 2,
    region: '甘肃岷县',
    efficacy: '补中益气、健脾益肺',
    usage: '适用于脾肺气虚、食少倦怠、咳嗽气短等',
    feature: '质地松软，断面平整，气味特殊',
    price: 120,
    priceChange: '+2%',
    demand: '中高',
    reviews: 96,
    quality: 'A',
    tags: ['补气', '常用']
  },
  {
    id: 3,
    name: '川芎',
    latinName: 'Ligusticum chuanxiong',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.5,
    rank: 3,
    region: '四川都江堰',
    efficacy: '活血行气，祛风止痛',
    usage: '用于月经不调、经闭痛经、头痛眩晕等',
    feature: '气味芳香浓烈，为常用活血化瘀药',
    price: 85,
    priceChange: '+1%',
    demand: '中',
    reviews: 88,
    quality: 'A',
    tags: ['活血', '祛风']
  },
  {
    id: 4,
    name: '当归',
    latinName: 'Angelica sinensis',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.7,
    rank: 4,
    region: '甘肃岷县',
    efficacy: '补血活血，调经止痛',
    usage: '用于血虚萎黄、月经不调、虚寒腹痛等',
    feature: '气味芳香，甜中带苦，为补血良药',
    price: 150,
    priceChange: '+3%',
    demand: '高',
    reviews: 105,
    quality: 'A',
    tags: ['补血', '名贵']
  },
  {
    id: 5,
    name: '三七',
    latinName: 'Panax notoginseng',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.9,
    rank: 5,
    region: '云南文山',
    efficacy: '散瘀止血，消肿定痛',
    usage: '用于咯血、吐血、外伤出血、跌打损伤等',
    feature: '云南特产，被誉为"金不换"',
    price: 350,
    priceChange: '+8%',
    demand: '极高',
    reviews: 156,
    quality: 'A+',
    tags: ['名贵', '止血', '热销']
  },
  {
    id: 6,
    name: '枸杞',
    latinName: 'Lycium barbarum',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.4,
    rank: 6,
    region: '宁夏中宁',
    efficacy: '滋补肝肾，明目',
    usage: '用于肝肾阴虚、头晕目眩、视力减退等',
    feature: '宁夏特产，营养丰富',
    price: 80,
    priceChange: '0%',
    demand: '中高',
    reviews: 92,
    quality: 'B+',
    tags: ['滋补', '日常']
  },
  {
    id: 7,
    name: '白芍',
    latinName: 'Paeonia lactiflora',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.3,
    rank: 7,
    region: '安徽亳州',
    efficacy: '养血调经，敛阴止汗',
    usage: '用于月经不调、自汗盗汗、腹痛腹泻等',
    feature: '色白质优，药用价值高',
    price: 95,
    priceChange: '-1%',
    demand: '中',
    reviews: 78,
    quality: 'B+',
    tags: ['养血', '常用']
  },
  {
    id: 8,
    name: '天麻',
    latinName: 'Gastrodia elata',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.5,
    rank: 8,
    region: '四川绵阳',
    efficacy: '息风止痉，平抑肝阳',
    usage: '用于头痛眩晕、肢体麻木、小儿惊风等',
    feature: '质地细腻，断面呈淡黄色',
    price: 180,
    priceChange: '+4%',
    demand: '中高',
    reviews: 85,
    quality: 'A',
    tags: ['名贵', '止痉']
  },
  {
    id: 9,
    name: '黄芪',
    latinName: 'Astragalus membranaceus',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.2,
    rank: 9,
    region: '内蒙古',
    efficacy: '补气固表，利水消肿',
    usage: '用于气虚乏力、自汗、水肿等',
    feature: '质地坚实，断面纤维性强',
    price: 60,
    priceChange: '-2%',
    demand: '中',
    reviews: 72,
    quality: 'B',
    tags: ['补气', '常用']
  },
  {
    id: 10,
    name: '石斛',
    latinName: 'Dendrobium nobile',
    image: '/images/黄连.jpg', // 替代图片
    score: 4.7,
    rank: 10,
    region: '云南西双版纳',
    efficacy: '养阴清热，益胃生津',
    usage: '用于阴虚发热、口干咽燥、胃阴不足等',
    feature: '茎节明显，质地坚韧',
    price: 320,
    priceChange: '+6%',
    demand: '高',
    reviews: 98,
    quality: 'A',
    tags: ['名贵', '养阴']
  }
];

// 模拟地区排名数据
const regionRankings = [
  { region: '重庆石柱', score: 4.9, herbs: ['黄连', '厚朴', '杜仲'], quality: 'A+', production: 1200, change: '+5%' },
  { region: '云南文山', score: 4.8, herbs: ['三七', '石斛', '重楼'], quality: 'A+', production: 1500, change: '+8%' },
  { region: '甘肃岷县', score: 4.7, herbs: ['党参', '当归', '黄芪'], quality: 'A', production: 1800, change: '+3%' },
  { region: '四川都江堰', score: 4.6, herbs: ['川芎', '川贝', '天麻'], quality: 'A', production: 1300, change: '+2%' },
  { region: '安徽亳州', score: 4.5, herbs: ['白芍', '牡丹皮', '柴胡'], quality: 'A', production: 2200, change: '+1%' },
  { region: '宁夏中宁', score: 4.4, herbs: ['枸杞', '甘草', '麻黄'], quality: 'B+', production: 1100, change: '0%' },
  { region: '内蒙古', score: 4.3, herbs: ['黄芪', '防风', '柴胡'], quality: 'B+', production: 1600, change: '-1%' },
  { region: '云南西双版纳', score: 4.7, herbs: ['石斛', '重楼', '血竭'], quality: 'A', production: 900, change: '+6%' },
  { region: '四川绵阳', score: 4.5, herbs: ['天麻', '川芎', '黄柏'], quality: 'A', production: 1000, change: '+4%' },
  { region: '湖北恩施', score: 4.4, herbs: ['天麻', '杜仲', '五味子'], quality: 'B+', production: 1200, change: '+2%' }
];

// 表格列定义
const herbColumns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
    width: 80,
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
          <Link href={`/herb?id=${text}`}>
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
    render: (text) => (
      <Text strong>{text}</Text>
    ),
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 180,
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
    render: quality => {
      const color = quality === 'A+' ? '#f56a00' : quality === 'A' ? '#52c41a' : quality === 'B+' ? '#1677ff' : '#faad14';
      return <Tag color={color}>{quality}</Tag>;
    },
  },
  {
    title: '代表药材',
    dataIndex: 'herbs',
    key: 'herbs',
    render: herbs => (
      <div>
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
        <Link href="/evaluation/herbs">
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