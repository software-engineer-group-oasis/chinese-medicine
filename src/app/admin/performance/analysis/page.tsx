// 统计分析页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Breadcrumb from 'antd/es/breadcrumb';
import Tooltip from 'antd/es/tooltip';
import Tabs from 'antd/es/tabs';
import Radio from 'antd/es/radio';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Statistic from 'antd/es/statistic';
import Table from 'antd/es/table';
import { 
  ArrowLeftOutlined, DownloadOutlined, ReloadOutlined,
  PieChartOutlined, LineChartOutlined, BarChartOutlined,
  RadarChartOutlined, RiseOutlined, FallOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ReactECharts from 'echarts-for-react';
// 导入模拟数据
import { 
  mockPerformanceRecords, 
  mockPerformanceTypes,
  mockPerformanceStats
} from '@/mock/performance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function PerformanceAnalysisPage() {
  // 状态管理
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 获取部门列表
  const getDepartments = () => {
    const departments = Array.from(new Set(mockPerformanceRecords.map(record => record.department)));
    return departments;
  };

  // 获取业绩类型分布数据
  const getPerformanceTypeData = () => {
    return mockPerformanceStats.typeDistribution.map(item => ({
      name: item.name,
      value: item.count
    }));
  };

  // 获取部门业绩分布数据
  const getDepartmentPerformanceData = () => {
    return mockPerformanceStats.departmentDistribution.map(item => ({
      name: item.name,
      value: item.count
    }));
  };

  // 获取月度业绩提交趋势数据
  const getMonthlySubmissionData = () => {
    const { months, counts } = mockPerformanceStats.monthlySubmissions;
    return { months, counts };
  };

  // 获取平均分数据
  const getAverageScoreData = () => {
    return mockPerformanceStats.averageScores.map(item => ({
      name: item.type,
      value: item.score
    }));
  };

  // 获取审核通过率数据
  const getApprovalRateData = () => {
    const total = mockPerformanceStats.total;
    const approved = mockPerformanceStats.approved;
    const rate = Math.round((approved / total) * 100);
    
    return [
      { name: '已通过', value: approved },
      { name: '未通过', value: total - approved }
    ];
  };

  // 获取业绩评分分布数据
  const getScoreDistributionData = () => {
    // 模拟数据：评分分布
    const scoreDistribution = [
      { range: '90-100', count: 15 },
      { range: '80-89', count: 25 },
      { range: '70-79', count: 18 },
      { range: '60-69', count: 10 },
      { range: '0-59', count: 5 }
    ];
    
    return scoreDistribution;
  };

  // 获取部门平均分排名数据
  const getDepartmentRankingData = () => {
    // 模拟数据：部门平均分排名
    return mockPerformanceStats.departmentDistribution.map(dept => ({
      department: dept.name,
      averageScore: Math.round(Math.random() * 20 + 70), // 模拟70-90之间的平均分
      count: dept.count
    })).sort((a, b) => b.averageScore - a.averageScore);
  };

  // 业绩类型分布图表配置
  const typeDistributionOption = {
    title: {
      text: '业绩类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: mockPerformanceTypes.map(type => type.name)
    },
    series: [
      {
        name: '业绩类型',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: getPerformanceTypeData()
      }
    ]
  };

  // 部门业绩分布图表配置
  const departmentDistributionOption = {
    title: {
      text: '部门业绩分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: getDepartments()
    },
    series: [
      {
        name: '部门业绩',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: getDepartmentPerformanceData()
      }
    ]
  };

  // 月度业绩提交趋势图表配置
  const monthlySubmissionOption = {
    title: {
      text: '业绩提交趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getMonthlySubmissionData().months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '提交数量',
        type: 'line',
        stack: '总量',
        data: getMonthlySubmissionData().counts,
        areaStyle: {},
        color: '#1677ff'
      }
    ]
  };

  // 平均分雷达图配置
  const averageScoreOption = {
    title: {
      text: '各类型业绩平均分',
      left: 'center'
    },
    tooltip: {},
    radar: {
      indicator: mockPerformanceTypes.map(type => ({
        name: type.name,
        max: 100
      }))
    },
    series: [
      {
        name: '平均分',
        type: 'radar',
        data: [
          {
            value: getAverageScoreData().map(item => item.value),
            name: '平均分',
            areaStyle: {
              color: 'rgba(22, 119, 255, 0.3)'
            },
            lineStyle: {
              color: '#1677ff'
            },
            itemStyle: {
              color: '#1677ff'
            }
          }
        ]
      }
    ]
  };

  // 审核通过率图表配置
  const approvalRateOption = {
    title: {
      text: '审核通过率',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['已通过', '未通过']
    },
    series: [
      {
        name: '审核结果',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `{d}%\n通过率`,
          fontSize: 20,
          fontWeight: 'bold'
        },
        emphasis: {
          label: {
            show: true
          }
        },
        labelLine: {
          show: false
        },
        data: getApprovalRateData(),
        color: ['#52c41a', '#f5222d']
      }
    ]
  };

  // 业绩评分分布图表配置
  const scoreDistributionOption = {
    title: {
      text: '业绩评分分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: getScoreDistributionData().map(item => item.range)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: getScoreDistributionData().map(item => item.count),
        itemStyle: {
          color: function(params: any) {
            const colorList = ['#f5222d', '#fa8c16', '#faad14', '#52c41a', '#1677ff'];
            return colorList[params.dataIndex];
          }
        }
      }
    ]
  };

  // 部门排名表格列定义
  const departmentRankingColumns = [
    {
      title: '排名',
      key: 'ranking',
      render: (_: any, _record: any, index: number) => index + 1
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '平均分',
      dataIndex: 'averageScore',
      key: 'averageScore',
      sorter: (a: any, b: any) => a.averageScore - b.averageScore,
      render: (score: number) => (
        <span>
          {score}
          {score >= 80 ? (
            <RiseOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
          ) : (
            <FallOutlined style={{ color: '#f5222d', marginLeft: 8 }} />
          )}
        </span>
      )
    },
    {
      title: '业绩数量',
      dataIndex: 'count',
      key: 'count',
    }
  ];

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>统计分析</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>统计分析</Title>
      <Text type="secondary" className="block mb-6">业绩数据的统计分析和可视化图表</Text>

      {/* 筛选工具栏 */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <Text strong className="mr-2">时间范围：</Text>
            <Radio.Group value={timeRange} onChange={e => setTimeRange(e.target.value)}>
              <Radio.Button value="month">月度</Radio.Button>
              <Radio.Button value="quarter">季度</Radio.Button>
              <Radio.Button value="year">年度</Radio.Button>
            </Radio.Group>
          </div>
          
          <div>
            <Text strong className="mr-2">部门：</Text>
            <Select 
              style={{ width: 150 }} 
              value={departmentFilter}
              onChange={setDepartmentFilter}
            >
              <Option value="all">全部</Option>
              {getDepartments().map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Text strong className="mr-2">业绩类型：</Text>
            <Select 
              style={{ width: 150 }} 
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Option value="all">全部</Option>
              {mockPerformanceTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Text strong className="mr-2">日期：</Text>
            <RangePicker 
              onChange={(dates, dateStrings) => {
                if (dates) {
                  setDateRange([dateStrings[0], dateStrings[1]]);
                } else {
                  setDateRange(null);
                }
              }} 
            />
          </div>
          
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={() => {
              // 重置筛选条件
              setTimeRange('month');
              setDepartmentFilter('all');
              setTypeFilter('all');
              setDateRange(null);
            }}
          >
            重置
          </Button>
          
          <Button 
            icon={<DownloadOutlined />}
          >
            导出报告
          </Button>
        </div>
      </Card>

      {/* 统计概览 */}
      <div className="mb-6">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总业绩数" 
                value={mockPerformanceStats.total} 
                suffix="条"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="已审核" 
                value={mockPerformanceStats.approved + mockPerformanceStats.rejected} 
                suffix="条"
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="通过率" 
                value={Math.round((mockPerformanceStats.approved / mockPerformanceStats.total) * 100)} 
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="平均分" 
                value={Math.round(mockPerformanceStats.averageScores.reduce((sum, item) => sum + item.score, 0) / mockPerformanceStats.averageScores.length * 10) / 10} 
                suffix="分"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 标签页 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><PieChartOutlined /> 概览分析</span>} 
          key="overview"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <ReactECharts option={typeDistributionOption} style={{ height: 400 }} />
            </Card>
            <Card>
              <ReactECharts option={departmentDistributionOption} style={{ height: 400 }} />
            </Card>
            <Card>
              <ReactECharts option={approvalRateOption} style={{ height: 400 }} />
            </Card>
            <Card>
              <ReactECharts option={averageScoreOption} style={{ height: 400 }} />
            </Card>
          </div>
        </TabPane>
        
        <TabPane 
          tab={<span><LineChartOutlined /> 趋势分析</span>} 
          key="trend"
        >
          <Card className="mb-6">
            <ReactECharts option={monthlySubmissionOption} style={{ height: 400 }} />
          </Card>
          
          <Card title="业绩提交趋势分析">
            <Paragraph>
              <InfoCircleOutlined className="mr-2" />
              根据上图数据分析，业绩提交呈现以下特点：
            </Paragraph>
            <ul className="list-disc pl-8 mb-4">
              <li>每月中旬（10-20日）是业绩提交的高峰期</li>
              <li>学期末（6月和12月）业绩提交量明显增加</li>
              <li>寒暑假期间（1-2月和7-8月）业绩提交量较低</li>
            </ul>
            <Paragraph>
              建议在业绩提交高峰期前，提前安排足够的审核人员，确保业绩审核工作能够及时完成。
            </Paragraph>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><BarChartOutlined /> 评分分析</span>} 
          key="score"
        >
          <Card className="mb-6">
            <ReactECharts option={scoreDistributionOption} style={{ height: 400 }} />
          </Card>
          
          <Card title="部门平均分排名" className="mb-6">
            <Table 
              columns={departmentRankingColumns} 
              dataSource={getDepartmentRankingData()}
              rowKey="department"
              pagination={false}
            />
          </Card>
          
          <Card title="评分分析报告">
            <Paragraph>
              <InfoCircleOutlined className="mr-2" />
              根据评分数据分析，得出以下结论：
            </Paragraph>
            <ul className="list-disc pl-8 mb-4">
              <li>大多数业绩评分集中在80-89分区间，表明整体业绩质量良好</li>
              <li>90分以上的优秀业绩占比约为20%，与行业平均水平相当</li>
              <li>不同部门之间的平均分差异不大，表明评分标准执行较为统一</li>
              <li>教学成果类业绩的平均分最高，科研成果次之</li>
            </ul>
            <Paragraph>
              建议对评分较低的业绩类型进行重点关注，提供相应的培训和支持，提高整体业绩质量。
            </Paragraph>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><RadarChartOutlined /> 对比分析</span>} 
          key="comparison"
        >
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Title level={4} className="text-center mb-4">各部门业绩数量对比</Title>
                <ReactECharts 
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'value'
                    },
                    yAxis: {
                      type: 'category',
                      data: getDepartmentPerformanceData().map(item => item.name)
                    },
                    series: [
                      {
                        name: '业绩数量',
                        type: 'bar',
                        data: getDepartmentPerformanceData().map(item => item.value)
                      }
                    ]
                  }} 
                  style={{ height: 300 }} 
                />
              </div>
              <div>
                <Title level={4} className="text-center mb-4">各类型业绩数量对比</Title>
                <ReactECharts 
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'value'
                    },
                    yAxis: {
                      type: 'category',
                      data: getPerformanceTypeData().map(item => item.name)
                    },
                    series: [
                      {
                        name: '业绩数量',
                        type: 'bar',
                        data: getPerformanceTypeData().map(item => item.value)
                      }
                    ]
                  }} 
                  style={{ height: 300 }} 
                />
              </div>
            </div>
          </Card>
          
          <Card title="年度对比分析" className="mb-6">
            <ReactECharts 
              option={{
                title: {
                  text: '近三年业绩数量和平均分对比',
                  left: 'center'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    crossStyle: {
                      color: '#999'
                    }
                  }
                },
                legend: {
                  data: ['业绩数量', '平均分'],
                  bottom: 10
                },
                xAxis: [
                  {
                    type: 'category',
                    data: ['2021年', '2022年', '2023年'],
                    axisPointer: {
                      type: 'shadow'
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: '业绩数量',
                    min: 0,
                    max: 100,
                    interval: 20
                  },
                  {
                    type: 'value',
                    name: '平均分',
                    min: 0,
                    max: 100,
                    interval: 20
                  }
                ],
                series: [
                  {
                    name: '业绩数量',
                    type: 'bar',
                    data: [45, 65, 73]
                  },
                  {
                    name: '平均分',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [78, 82, 85]
                  }
                ]
              }} 
              style={{ height: 400 }} 
            />
          </Card>
          
          <Card title="对比分析报告">
            <Paragraph>
              <InfoCircleOutlined className="mr-2" />
              通过对比分析，发现以下趋势：
            </Paragraph>
            <ul className="list-disc pl-8 mb-4">
              <li>近三年来，业绩数量呈现稳步增长趋势，2023年比2021年增长了62%</li>
              <li>业绩平均分也在逐年提高，表明业绩质量不断提升</li>
              <li>中医学院和药学院是业绩提交最活跃的部门，两者合计占总业绩的65%</li>
              <li>科研成果和教学成果是主要的业绩类型，占总业绩的78%</li>
            </ul>
            <Paragraph>
              建议继续加强对业绩质量的管理，特别是对业绩数量较少的部门提供更多支持和激励措施。
            </Paragraph>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}