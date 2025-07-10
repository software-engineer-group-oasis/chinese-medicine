// 工作业绩管理模块主页面
"use client"
import { useState, useMemo } from 'react';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Statistic from 'antd/es/statistic';
import { 
  LineChartOutlined, AuditOutlined, FileSearchOutlined, 
  HistoryOutlined, ExportOutlined, StarOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
// 导入echarts图表组件
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import useAxios from '@/hooks/useAxios';

export default function PerformancePage() {
  // 获取业绩统计数据（后端接口）
  const { data: statisticsData, loading: statisticsLoading } = useAxios(
    '/performance-service/performances/statistics',
    'GET',
    null,
    null
  ) as any;

  // 使用useMemo优化数据处理
  const processedData = useMemo(() => {
    const stats = statisticsData?.data || {};
    
    // 处理类型分布数据
    const typeDistributionArr = stats.typeDistribution
      ? Object.entries(stats.typeDistribution)
          .map(([performTypeName, count]) => ({ performTypeName, count }))
          .filter((item: any) => item.count > 0)
      : [];

    // 处理月度趋势数据
    const monthlyTrendArr = stats.monthlyTrend
      ? Object.entries(stats.monthlyTrend)
          .map(([month, count]) => ({ month, count }))
          .filter((item: any) => item.count > 0)
          .sort((a: any, b: any) => a.month.localeCompare(b.month))
      : [];

    return {
      typeDistributionArr,
      monthlyTrendArr,
      stats
    };
  }, [statisticsData]);

  // 业绩类型分布饼图配置
  const typeDistributionOption: EChartsOption = {
    title: {
      text: '业绩类型分布',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: processedData.typeDistributionArr.map((item: any) => item.performTypeName)
    },
    series: [
      {
        name: '业绩类型',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: processedData.typeDistributionArr.map((item: any, idx: number) => ({
          value: item.count,
          name: item.performTypeName,
          itemStyle: { color: ['#1677ff', '#52c41a', '#722ed1', '#faad14', '#f5222d'][idx % 5] }
        }))
      }
    ]
  };

  // 月度提交趋势图表配置
  const monthlySubmissionOption: EChartsOption = {
    title: {
      text: '月度业绩提交趋势',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: processedData.monthlyTrendArr.map((item: any) => item.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '提交数量',
        type: 'line',
        smooth: true,
        data: processedData.monthlyTrendArr.map((item: any) => item.count),
        itemStyle: {
          color: '#1677ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(22, 119, 255, 0.5)'
            }, {
              offset: 1, color: 'rgba(22, 119, 255, 0.1)'
            }]
          }
        }
      }
    ]
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">工作业绩管理系统</h1>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="总业绩数" 
              value={processedData.stats.totalCount || 0} 
              prefix={<LineChartOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="待审核业绩" 
              value={processedData.stats.pendingCount || 0} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已通过业绩" 
              value={processedData.stats.approvedCount || 0} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已驳回业绩" 
              value={processedData.stats.rejectedCount || 0} 
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能导航卡片 */}
      <h2 className="text-xl font-semibold mb-4">功能导航</h2>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/performance/review">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-blue-50 p-6 flex justify-center"><AuditOutlined style={{ fontSize: '48px', color: '#1677ff' }} /></div>}
            >
              <Card.Meta 
                title="业绩审核" 
                description="审核教师/科研人员上传的工作业绩，进行评语" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/performance/export">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-green-50 p-6 flex justify-center"><ExportOutlined style={{ fontSize: '48px', color: '#52c41a' }} /></div>}
            >
              <Card.Meta 
                title="业绩导出" 
                description="导出业绩评价详情，包括通过/未通过业绩" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/performance/analysis">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-red-50 p-6 flex justify-center"><FileSearchOutlined style={{ fontSize: '48px', color: '#f5222d' }} /></div>}
            >
              <Card.Meta 
                title="统计分析" 
                description="业绩数据的统计分析和可视化展示" 
              />
            </Card>
          </Link>
        </Col>
      </Row>

      {/* 数据可视化 */}
      <Divider orientation="left">数据分析</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <ReactECharts option={typeDistributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <ReactECharts option={monthlySubmissionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
