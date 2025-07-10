"use client"
import { useState, useEffect } from 'react';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Statistic from 'antd/es/statistic';
import { BookOutlined, VideoCameraOutlined, TagsOutlined, AppstoreOutlined, BarChartOutlined, CloudUploadOutlined, ExperimentOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import ReactECharts from 'echarts-for-react';
import axiosInstance from '@/api/config';
//@ts-ignore
import { HERB_API, COURSE_HERB_API, COURSE_API, LAB_API, RESOURCE_API, CATEGORY_API } from '@/api/HerbInfoApi';
import { message } from 'antd';

interface TeachingStats {
  totalCourses: number;
  totalResources: number;
  totalCategories: number;
  totalTags: number;
  totalVisits: number;
  totalHerbs: number;
  totalLabs: number;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface ResourceType {
  type: string;
  count: number;
}

interface VisitData {
  month: string;
  visits: number;
}

export default function TeachingPage() {
  const [stats, setStats] = useState<TeachingStats>({
    totalCourses: 10,
    totalResources: 13,
    totalCategories: 3,
    totalTags: 3,
    totalVisits: 40,
    totalHerbs: 10,
    totalLabs: 10
    });
  const [categories, setCategories] = useState<Category[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // 并行获取各种数据
      const [
        coursesResponse,
        herbsResponse,
        labsResponse,
        categoriesResponse,
        resourcesResponse
      ] = await Promise.all([
        axiosInstance.get(COURSE_API.GET_COURSES()),
        axiosInstance.get(HERB_API.GET_ALL_HERBS),
        axiosInstance.get(LAB_API.GET_ALL_LABS()),
        axiosInstance.get(CATEGORY_API.GET_ALL_CATEGORIES()),
        //@ts-ignore
        axiosInstance.get(RESOURCE_API.GET_ALL_RESOURCES())
      ]);

      // 计算统计数据
      const totalCourses = coursesResponse.data.code === 0 ? (coursesResponse.data.data?.list?.length || coursesResponse.data.data?.length || 0) : 10;
      const totalHerbs = herbsResponse.data.code === 0 ? (herbsResponse.data.herbs?.length || 0) : 0;
      const totalLabs = labsResponse.data.code === 0 ? (labsResponse.data.data?.length || 0) : 0;
      const totalCategories = categoriesResponse.data.code === 0 ? (categoriesResponse.data.data?.length || 0) : 0;
      const totalResources = resourcesResponse.data.code === 0 ? (resourcesResponse.data.data?.length || 0) : 0;

      setStats({
        totalCourses,
        totalResources,
        totalCategories,
        totalTags: 18, // 暂时使用固定值
        totalVisits: 1024, // 暂时使用固定值
        totalHerbs,
        totalLabs
      });

      // 同时处理类别统计和资源类型统计
      if (categoriesResponse.data.code === 0) {
        const categoriesData = categoriesResponse.data.data || [];
        
        // 统计每个类别的课程数量
        const categoryStats = await Promise.all(
          categoriesData.map(async (category: any) => {
            try {
              // 根据API文档，使用正确的查询参数
              const coursesResponse = await axiosInstance.get(COURSE_API.GET_COURSES({ categoryId: category.id }));
              const count = coursesResponse.data.code === 0 ? (coursesResponse.data.data?.list?.length || coursesResponse.data.data?.length || 0) : 0;
              return {
                id: category.id,
                name: category.name,
                count
              };
            } catch (error) {
              console.error(`获取类别 ${category.name} 统计错误:`, error);
              return {
                id: category.id,
                name: category.name,
                count: 0
              };
            }
          })
        );
        
        setCategories(categoryStats);
      }

      if (resourcesResponse.data.code === 0) {
        const resources = resourcesResponse.data.data || [];
        
        // 统计资源类型 - 根据API文档，resourceType字段
        const typeCount: Record<string, number> = {};
        resources.forEach((resource: any) => {
          // 根据API文档，resourceType: 0表示视频, 1表示文档
          const type = resource.courseResourceType === 0 ? '视频' : 
                      resource.courseResourceType === 1 ? '文档' : '其他';
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
        
        const resourceTypesData = Object.entries(typeCount).map(([type, count]) => ({
          type,
          count
        }));
        
        setResourceTypes(resourceTypesData);
      }

    } catch (error) {
      console.error('获取统计数据错误:', error);
      message.error('获取统计数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取访问量趋势（模拟数据）
  const fetchVisitData = async () => {
    // 由于没有访问量API，使用模拟数据
    // 可以根据实际需求添加访问量统计API
    const mockVisitData = [
      { month: '1月', visits: 120 },
      { month: '2月', visits: 132 },
      { month: '3月', visits: 101 },
      { month: '4月', visits: 134 },
      { month: '5月', visits: 90 },
      { month: '6月', visits: 230 },
      { month: '7月', visits: 210 }
    ];
    setVisitData(mockVisitData);
  };

  // 计算总访问量
  const calculateTotalVisits = () => {
    return visitData.reduce((sum, item) => sum + item.visits, 0);
  };

  useEffect(() => {
    fetchStats();
    fetchVisitData();
  }, []);

  // 更新统计信息，包括访问量
  useEffect(() => {
    if (visitData.length > 0) {
      setStats(prev => ({
        ...prev,
        totalVisits: calculateTotalVisits()
      }));
    }
  }, [visitData]);

  // 课程类别分布数据
  const categoryPieData = categories.map(cat => ({
    value: cat.count,
    name: cat.name
  }));

  // 资源类型分布数据
  const resourcePieData = resourceTypes.map(type => ({
    value: type.count,
    name: type.type
  }));

  // 访问量趋势数据
  const visitLineData = visitData.map(item => item.visits);
  const visitLineLabels = visitData.map(item => item.month);

  const visitLineOption = {
    title: { text: '访问量趋势', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: visitLineLabels },
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
        <Col xs={24} sm={12} md={4}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="课程总数" 
              value={stats.totalCourses} 
              prefix={<BookOutlined />} 
              valueStyle={{ color: '#1677ff' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="资源总数" 
              value={stats.totalResources} 
              prefix={<CloudUploadOutlined />} 
              valueStyle={{ color: '#52c41a' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="中草药总数" 
              value={stats.totalHerbs} 
              prefix={<span>🌿</span>} 
              valueStyle={{ color: '#52c41a' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="实验总数" 
              value={stats.totalLabs} 
              prefix={<ExperimentOutlined />} 
              valueStyle={{ color: '#fa8c16' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="课程类别" 
              value={stats.totalCategories} 
              prefix={<AppstoreOutlined />} 
              valueStyle={{ color: '#faad14' }}
              loading={loading}
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
              loading={loading}
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
        {/* <Col xs={24} sm={12} md={8}>
          <Link href="/admin/teaching/herbs">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-green-50 p-6 flex justify-center"><span style={{ fontSize: '48px', color: '#52c41a' }}>🌿</span></div>}
            >
              <Card.Meta 
                title="中草药管理" 
                description="管理中草药信息、分类、关联关系" 
              />
            </Card>
          </Link>
        </Col> */}
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
          <Link href="/admin/teaching/labs">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-orange-50 p-6 flex justify-center"><ExperimentOutlined style={{ fontSize: '48px', color: '#fa8c16' }} /></div>}
            >
              <Card.Meta 
                title="实验管理" 
                description="管理课程实验，查看实验详情，支持批量操作" 
              />
            </Card>
          </Link>
        </Col> */}
      </Row>

      {/* 数据可视化区块 */}
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
