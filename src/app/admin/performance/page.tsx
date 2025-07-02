// 工作业绩管理模块主页面
"use client"
import { useState } from 'react';
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
// 导入模拟数据
import { mockPerformanceStats } from '@/mock/performance';

export default function PerformancePage() {
  // 使用模拟数据统计
  const [stats] = useState(mockPerformanceStats);

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
      data: stats.typeDistribution.map(item => item.type)
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
        data: [
          { value: stats.typeDistribution[0].count, name: stats.typeDistribution[0].type, itemStyle: { color: '#1677ff' } },
          { value: stats.typeDistribution[1].count, name: stats.typeDistribution[1].type, itemStyle: { color: '#52c41a' } },
          { value: stats.typeDistribution[2].count, name: stats.typeDistribution[2].type, itemStyle: { color: '#722ed1' } },
          { value: stats.typeDistribution[3].count, name: stats.typeDistribution[3].type, itemStyle: { color: '#faad14' } }
        ]
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
      data: stats.monthlySubmission.map(item => item.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '提交数量',
        type: 'line',
        smooth: true,
        data: stats.monthlySubmission.map(item => item.count),
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

  // 平均分数雷达图配置
  const scoreRadarOption: EChartsOption = {
    title: {
      text: '各类业绩平均分数',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: stats.typeDistribution.map(item => ({
        name: item.type,
        max: 100
      })),
      radius: 120
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: stats.typeDistribution.map(item => item.avgScore || 0),
            name: '平均分数',
            areaStyle: {
              color: 'rgba(82, 196, 26, 0.2)'
            },
            lineStyle: {
              color: '#52c41a'
            },
            itemStyle: {
              color: '#52c41a'
            }
          }
        ]
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
              value={stats.totalCount} 
              prefix={<LineChartOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="待审核业绩" 
              value={stats.pendingCount} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已通过业绩" 
              value={stats.approvedCount} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已驳回业绩" 
              value={stats.rejectedCount} 
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
                title="业绩审核与评分" 
                description="审核教师/科研人员上传的工作业绩，进行评分和评语" 
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
                description="导出业绩评价详情，包括通过/未通过业绩和最终分数" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/performance/standards">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-purple-50 p-6 flex justify-center"><StarOutlined style={{ fontSize: '48px', color: '#722ed1' }} /></div>}
            >
              <Card.Meta 
                title="评分标准管理" 
                description="设置不同类型业绩的评分标准和权重" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/performance/history">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-yellow-50 p-6 flex justify-center"><HistoryOutlined style={{ fontSize: '48px', color: '#faad14' }} /></div>}
            >
              <Card.Meta 
                title="审核历史" 
                description="查看历史审核记录和审核日志" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/performance/statistics">
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
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-sm">
            <ReactECharts option={typeDistributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-sm">
            <ReactECharts option={monthlySubmissionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-sm">
            <ReactECharts option={scoreRadarOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
