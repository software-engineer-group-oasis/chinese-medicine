"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Statistic from 'antd/es/statistic';
import { BookOutlined, VideoCameraOutlined, TagsOutlined, AppstoreOutlined, BarChartOutlined, CloudUploadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import ReactECharts from 'echarts-for-react';
import { mockCategories, mockResources } from '@/mock/teaching';

export default function TeachingPage() {
  // 模拟统计数据
  const [stats] = useState({
    totalCourses: 42,
    totalResources: 128,
    totalCategories: 6,
    totalTags: 18,
    totalVisits: 1024
  });

  // 课程类别分布数据
  const categoryPieData = mockCategories.map(cat => ({
    value: stats.totalCourses / mockCategories.length, // mock数据均分
    name: cat.name
  }));

  // 资源类型分布数据
  const resourceTypeCount = mockResources.reduce((acc, cur) => {
    acc[cur.type] = (acc[cur.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const resourcePieData = [
    { value: resourceTypeCount['video'] || 0, name: '视频' },
    { value: resourceTypeCount['pdf'] || 0, name: 'PDF文档' },
    { value: resourceTypeCount['ppt'] || 0, name: 'PPT' }
  ];

  // 访问量趋势（mock）
  const visitLineData = [120, 132, 101, 134, 90, 230, 210];
  const visitLineOption = {
    title: { text: '访问量趋势', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月','7月'] },
    yAxis: { type: 'value' },
    series: [{
      name: '访问量', type: 'line', smooth: true, data: visitLineData,
      itemStyle: { color: '#1677ff' },
      areaStyle: { color: 'rgba(22,119,255,0.15)' }
    }]
  };

  const categoryPieOption = {
    title: { text: '课程类别分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: '类别', type: 'pie', radius: '60%', center: ['50%', '60%'], data: categoryPieData,
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' } }
    }]
  };

  const resourcePieOption = {
    title: { text: '资源类型分布', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: '资源类型', type: 'pie', radius: '60%', center: ['50%', '60%'], data: resourcePieData,
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' } }
    }]
  };

  return (
    <div className="p-6">
      <AdminBreadcrumb className="mb-4" items={[
        { title: '教学实验管理' }
      ]} />
      <h1 className="text-2xl font-bold mb-2">教学实验管理系统</h1>
      <div className="text-gray-500 mb-6">课程内容、资源、分类、标签、统计等一站式管理</div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={5}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="课程总数" 
              value={stats.totalCourses} 
              prefix={<BookOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="资源总数" 
              value={stats.totalResources} 
              prefix={<CloudUploadOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="课程类别" 
              value={stats.totalCategories} 
              prefix={<AppstoreOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="标签数量" 
              value={stats.totalTags} 
              prefix={<TagsOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="访问量" 
              value={stats.totalVisits} 
              prefix={<BarChartOutlined />} 
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能导航卡片 */}
      <h2 className="text-xl font-semibold mb-4">功能导航</h2>
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/teaching/courses">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-blue-50 p-6 flex justify-center"><BookOutlined style={{ fontSize: '48px', color: '#1677ff' }} /></div>}
            >
              <Card.Meta 
                title="课程管理" 
                description="查看、编辑、排序、删除课程，管理课程内容" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/teaching/resources">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-green-50 p-6 flex justify-center"><VideoCameraOutlined style={{ fontSize: '48px', color: '#52c41a' }} /></div>}
            >
              <Card.Meta 
                title="资源管理" 
                description="上传、预览、下载课程视频和文档" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/teaching/categories">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-yellow-50 p-6 flex justify-center"><AppstoreOutlined style={{ fontSize: '48px', color: '#faad14' }} /></div>}
            >
              <Card.Meta 
                title="类别管理" 
                description="增删改查课程类别，设置课程分类体系" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/teaching/tags">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-purple-50 p-6 flex justify-center"><TagsOutlined style={{ fontSize: '48px', color: '#722ed1' }} /></div>}
            >
              <Card.Meta 
                title="标签管理" 
                description="增删改查课程标签，支持批量打标签" 
              />
            </Card>
          </Link>
        </Col>
        {/* <Col xs={24} sm={12} md={8}>
          <Link href="/admin/teaching/statistics">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-red-50 p-6 flex justify-center"><BarChartOutlined style={{ fontSize: '48px', color: '#f5222d' }} /></div>}
            >
              <Card.Meta 
                title="统计分析" 
                description="课程访问量、资源下载量等数据分析" 
              />
            </Card>
          </Link>
        </Col> */}
      </Row>

      {/* 数据可视化区块（可后续补充ECharts图表） */}
      <Divider orientation="left">数据可视化</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <ReactECharts option={categoryPieOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <ReactECharts option={resourcePieOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <ReactECharts option={visitLineOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
