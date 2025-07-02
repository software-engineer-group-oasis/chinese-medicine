// 中药评价与申报模块主页面
"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import Statistic from 'antd/es/statistic';
import { LineChartOutlined, FormOutlined, FileSearchOutlined, HistoryOutlined, ExportOutlined, StarOutlined } from '@ant-design/icons';
import Link from 'next/link';
// 导入echarts图表组件
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

export default function EvaluationPage() {
  // 模拟评价数据统计
  const [stats] = useState({
    totalEvaluations: 128,
    pendingEvaluations: 15,
    completedEvaluations: 113,
    standardVersions: 3
  });

  // 评价趋势图表配置
  const trendOption: EChartsOption = {
    title: {
      text: '近期评价趋势',
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
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '评价数量',
        type: 'line',
        smooth: true,
        data: [12, 18, 24, 32, 28, 14],
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

  // 评价分布饼图配置
  const distributionOption: EChartsOption = {
    title: {
      text: '评价结果分布',
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
      data: ['优秀', '良好', '合格', '待改进', '不合格']
    },
    series: [
      {
        name: '评价结果',
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
          { value: 35, name: '优秀', itemStyle: { color: '#52c41a' } },
          { value: 42, name: '良好', itemStyle: { color: '#1677ff' } },
          { value: 26, name: '合格', itemStyle: { color: '#faad14' } },
          { value: 8, name: '待改进', itemStyle: { color: '#fa8c16' } },
          { value: 2, name: '不合格', itemStyle: { color: '#f5222d' } }
        ]
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">中药评价与申报管理系统</h1>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="总评价数" 
              value={stats.totalEvaluations} 
              prefix={<LineChartOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="待处理评价" 
              value={stats.pendingEvaluations} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="已完成评价" 
              value={stats.completedEvaluations} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title="评价标准版本" 
              value={stats.standardVersions} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能导航卡片 */}
      <h2 className="text-xl font-semibold mb-4">功能导航</h2>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/evaluation/form-design">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-blue-50 p-6 flex justify-center"><FormOutlined style={{ fontSize: '48px', color: '#1677ff' }} /></div>}
            >
              <Card.Meta 
                title="评价表单自定义" 
                description="设置药材外观、成分含量、来源渠道等评价维度" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/evaluation/record-entry">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-green-50 p-6 flex justify-center"><FileSearchOutlined style={{ fontSize: '48px', color: '#52c41a' }} /></div>}
            >
              <Card.Meta 
                title="评价记录录入" 
                description="填写打分、文字说明，上传图文材料佐证" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/evaluation/standard-versions">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-purple-50 p-6 flex justify-center"><HistoryOutlined style={{ fontSize: '48px', color: '#722ed1' }} /></div>}
            >
              <Card.Meta 
                title="评价标准版本控制" 
                description="配置不同版本的评价标准，并记录使用历史" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/evaluation/results">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-yellow-50 p-6 flex justify-center"><ExportOutlined style={{ fontSize: '48px', color: '#faad14' }} /></div>}
            >
              <Card.Meta 
                title="结果查询与导出" 
                description="条件筛选、批量导出评价记录" 
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link href="/admin/evaluation/application">
            <Card 
              hoverable 
              className="h-full"
              cover={<div className="bg-red-50 p-6 flex justify-center"><FileSearchOutlined style={{ fontSize: '48px', color: '#f5222d' }} /></div>}
            >
              <Card.Meta 
                title="申报材料联动" 
                description="从评价数据生成申报用的报告模板" 
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
            <ReactECharts option={trendOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <ReactECharts option={distributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}