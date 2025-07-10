// 统计分析页面
"use client"
import React, { useState, useMemo } from 'react';
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
import useAxios from '@/hooks/useAxios';
import axiosInstance from '@/api/config';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function PerformanceAnalysisPage() {
  // 状态管理
  const [activeTab, setActiveTab] = useState('overview');

  // 获取业绩统计数据（后端接口）
  const { data: statisticsData, loading: statisticsLoading } = useAxios(
    '/performance-service/performances/statistics',
    'GET',
    null,
    null
  ) as any;

  // 获取业绩类型列表
  const { data: performanceTypesData } = useAxios(
    '/performance-service/perform-types',
    'GET',
    null,
    null
  ) as any;

  // 获取业绩列表数据（用于详细分析）
  const { data: performanceListData } = useAxios(
    '/performance-service/performances',
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

  // 获取业绩类型分布数据
  const getPerformanceTypeData = () => {
    return processedData.typeDistributionArr.map((item: any) => ({
      name: item.performTypeName,
      value: item.count
    }));
  };

  // 获取月度业绩提交趋势数据
  const getMonthlySubmissionData = () => {
    return {
      months: processedData.monthlyTrendArr.map((item: any) => item.month),
      counts: processedData.monthlyTrendArr.map((item: any) => item.count)
    };
  };

  // 生成趋势分析文字
  const generateTrendAnalysis = () => {
    const monthlyData = getMonthlySubmissionData();
    if (monthlyData.months.length === 0) {
      return {
        trend: "暂无趋势数据",
        peakAnalysis: "暂无数据",
        lowAnalysis: "暂无数据",
        avgCount: 0,
        totalCount: 0,
        maxCount: 0,
        minCount: 0
      };
    }

    const counts = monthlyData.counts;
    const totalCount = counts.reduce((sum: number, count: number) => sum + count, 0);
    const avgCount = totalCount / counts.length;
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const maxMonth = monthlyData.months[counts.indexOf(maxCount)];
    const minMonth = monthlyData.months[counts.indexOf(minCount)];

    // 计算趋势
    let trend = "";
    if (counts.length >= 2) {
      const recentTrend = counts.slice(-3); // 最近3个月
      const isIncreasing = recentTrend.every((val: number, idx: number) => 
        idx === 0 || val >= recentTrend[idx - 1]
      );
      const isDecreasing = recentTrend.every((val: number, idx: number) => 
        idx === 0 || val <= recentTrend[idx - 1]
      );
      
      if (isIncreasing) {
        trend = "呈现上升趋势";
      } else if (isDecreasing) {
        trend = "呈现下降趋势";
      } else {
        trend = "呈现波动趋势";
      }
    }

    // 识别高峰期和低谷期
    const currentYear = new Date().getFullYear();
    const semesterEndMonths = [6, 12]; // 学期末月份
    const vacationMonths = [1, 2, 7, 8]; // 寒暑假月份
    
    const maxMonthNum = parseInt(maxMonth.split('-')[1]);
    const minMonthNum = parseInt(minMonth.split('-')[1]);
    const isSemesterEnd = semesterEndMonths.includes(maxMonthNum);
    const isVacation = vacationMonths.includes(minMonthNum);

    let peakAnalysis = "";
    if (isSemesterEnd) {
      peakAnalysis = `高峰期出现在${maxMonth}（学期末），符合教学周期规律`;
    } else {
      peakAnalysis = `高峰期出现在${maxMonth}，提交数量达到${maxCount}条`;
    }

    let lowAnalysis = "";
    if (isVacation) {
      lowAnalysis = `低谷期出现在${minMonth}（寒暑假期间），符合假期规律`;
    } else {
      lowAnalysis = `低谷期出现在${minMonth}，提交数量为${minCount}条`;
    }

    return {
      trend,
      peakAnalysis,
      lowAnalysis,
      avgCount: Math.round(avgCount),
      totalCount,
      maxCount,
      minCount
    };
  };

  // 生成对比分析文字
  const generateComparisonAnalysis = () => {
    const typeData = getPerformanceTypeData();
    const yearlyData = getYearlyComparisonData();
    
    if (typeData.length === 0) {
      return {
        topType: { name: "暂无", value: 0 },
        secondType: { name: "暂无", value: 0 },
        typeGap: 0,
        typeGapPercent: 0,
        topTypePercent: 0,
        secondTypePercent: 0,
        yearlyTrend: "暂无数据",
        totalTypeCount: 0
      };
    }

    // 类型分析
    const sortedTypes = [...typeData].sort((a: any, b: any) => b.value - a.value);
    const topType = sortedTypes[0];
    const secondType = sortedTypes[1];
    const typeGap = topType.value - secondType.value;
    const typeGapPercent = Math.round((typeGap / topType.value) * 100);

    // 年度分析
    let yearlyTrend = "";
    if (yearlyData.length >= 2) {
      const recentYears = yearlyData.slice(-2);
      const growth = recentYears[1].count - recentYears[0].count;
      const growthPercent = Math.round((growth / recentYears[0].count) * 100);
      
      if (growth > 0) {
        yearlyTrend = `相比${recentYears[0].year}年增长了${growth}条（${growthPercent}%）`;
      } else if (growth < 0) {
        yearlyTrend = `相比${recentYears[0].year}年减少了${Math.abs(growth)}条（${Math.abs(growthPercent)}%）`;
      } else {
        yearlyTrend = `与${recentYears[0].year}年持平`;
      }
    }

    // 计算类型分布
    const totalTypeCount = typeData.reduce((sum: number, item: any) => sum + item.value, 0);
    const topTypePercent = Math.round((topType.value / totalTypeCount) * 100);
    const secondTypePercent = Math.round((secondType.value / totalTypeCount) * 100);

    return {
      topType,
      secondType,
      typeGap,
      typeGapPercent,
      topTypePercent,
      secondTypePercent,
      yearlyTrend,
      totalTypeCount
    };
  };

  // 获取审核通过率数据
  const getApprovalRateData = () => {
    const total = processedData.stats.totalCount || 0;
    const approved = processedData.stats.approvedCount || 0;
    const rejected = processedData.stats.rejectedCount || 0;
    const pending = processedData.stats.pendingCount || 0;
    
    return [
      { name: '已通过', value: approved },
      { name: '已驳回', value: rejected },
      { name: '待审核', value: pending }
    ];
  };

  // 获取年度对比数据
  const getYearlyComparisonData = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    
    // 从月度趋势数据中提取年度数据
    const yearlyData = years.map(year => {
      const yearData = processedData.monthlyTrendArr.filter((item: any) => 
        item.month.startsWith(year.toString())
      );
      return {
        year: year.toString(),
        count: yearData.reduce((sum: number, item: any) => sum + item.count, 0)
      };
    });
    
    return yearlyData;
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
      data: getPerformanceTypeData().map((item: any) => item.name)
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
        data: getPerformanceTypeData().map((item: any, idx: number) => ({
          ...item,
          itemStyle: { color: ['#1677ff', '#52c41a', '#722ed1', '#faad14', '#f5222d'][idx % 5] }
        }))
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
    xAxis: {
      type: 'category',
      data: getMonthlySubmissionData().months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '提交数量',
        type: 'line',
        smooth: true,
        data: getMonthlySubmissionData().counts,
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

  // 审核通过率图表配置
  const approvalRateOption = {
    title: {
      text: '审核状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: getApprovalRateData().map((item: any) => item.name)
    },
    series: [
      {
        name: '审核状态',
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
        data: getApprovalRateData().map((item: any, idx: number) => ({
          ...item,
          itemStyle: { 
            color: item.name === '已通过' ? '#52c41a' : 
                   item.name === '已驳回' ? '#f5222d' : '#faad14'
          }
        }))
      }
    ]
  };

  // 年度对比图表配置
  const yearlyComparisonOption = {
    title: {
      text: '年度业绩对比',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: getYearlyComparisonData().map((item: any) => `${item.year}年`)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '业绩数量',
        type: 'bar',
        data: getYearlyComparisonData().map((item: any) => item.count),
        itemStyle: {
          color: '#1677ff'
        }
      }
    ]
  };

  // 生成趋势分析文字
  const trendAnalysis = generateTrendAnalysis();
  const comparisonAnalysis = generateComparisonAnalysis();

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>统计分析</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>业绩统计分析</Title>
      <Text type="secondary" className="block mb-6">基于真实数据的业绩统计分析和可视化展示</Text>

      {/* 统计概览 */}
      <div className="mb-6">
        {statisticsLoading && (
          <div className="text-center mb-4">
            <Text type="secondary">正在加载数据...</Text>
          </div>
        )}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="总业绩数" 
                value={processedData.stats.totalCount || 0} 
                suffix="条"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="已审核" 
                value={(processedData.stats.approvedCount || 0) + (processedData.stats.rejectedCount || 0)} 
                suffix="条"
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="通过率" 
                value={Math.round((processedData.stats.approvedCount || 0) / ((processedData.stats.approvedCount || 0) + (processedData.stats.rejectedCount || 0) || 1) * 100)} 
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="未审核" 
                value={processedData.stats.pendingCount || 0} 
                suffix="条"
                valueStyle={{ color: '#722ed1' }}
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
              <ReactECharts option={approvalRateOption} style={{ height: 400 }} />
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
                <li>总体趋势：{trendAnalysis.trend}</li>
                <li>提交总量：共{trendAnalysis.totalCount}条业绩，平均每月{trendAnalysis.avgCount}条</li>
                <li>高峰期：{trendAnalysis.peakAnalysis}</li>
                <li>低谷期：{trendAnalysis.lowAnalysis}</li>
                <li>数据波动：最高月{trendAnalysis.maxCount}条，最低月{trendAnalysis.minCount}条，差异{trendAnalysis.maxCount - trendAnalysis.minCount}条</li>
              </ul>
              <Paragraph>
                建议在业绩提交高峰期前，提前安排足够的审核人员，确保业绩审核工作能够及时完成。
                {trendAnalysis.trend === "呈现上升趋势" && "同时建议继续保持这种良好的增长势头。"}
                {trendAnalysis.trend === "呈现下降趋势" && "建议分析下降原因，采取相应措施提升业绩提交积极性。"}
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
                      data: getPerformanceTypeData().map((item: { name: string; value: number }) => item.name)
                    },
                    series: [
                      {
                        name: '业绩数量',
                        type: 'bar',
                        data: getPerformanceTypeData().map((item: { name: string; value: number }) => item.value)
                      }
                    ]
                  }} 
                  style={{ height: 300 }} 
                />
              </div>
            </div>
          </Card>
          
          <Card title="年度对比分析" className="mb-6">
            <ReactECharts option={yearlyComparisonOption} style={{ height: 400 }} />
          </Card>
          
          <Card title="对比分析报告">
            <Paragraph>
              <InfoCircleOutlined className="mr-2" />
              通过对比分析，发现以下趋势：
            </Paragraph>
                          <ul className="list-disc pl-8 mb-4">
                <li>类型分布：{comparisonAnalysis.topType.name}类业绩占比最高（{comparisonAnalysis.topTypePercent}%），{comparisonAnalysis.secondType.name}类次之（{comparisonAnalysis.secondTypePercent}%）</li>
                <li>类型差异：{comparisonAnalysis.topType.name}比{comparisonAnalysis.secondType.name}多{comparisonAnalysis.typeGap}条，差距{comparisonAnalysis.typeGapPercent}%</li>
                <li>年度变化：{comparisonAnalysis.yearlyTrend}</li>
                <li>总体规模：共{comparisonAnalysis.totalTypeCount}条业绩，涵盖{getPerformanceTypeData().length}种类型</li>
              </ul>
              <Paragraph>
                {comparisonAnalysis.typeGapPercent > 50 ? 
                  "建议加强对业绩数量较少的类型提供更多支持和激励措施，促进各类型业绩均衡发展。" :
                  "各类型业绩分布相对均衡，建议继续保持这种良好的发展态势。"
                }
                {comparisonAnalysis.yearlyTrend && comparisonAnalysis.yearlyTrend.includes("增长") &&
                  "年度增长趋势良好，说明业绩管理工作取得了积极成效。"
                }
              </Paragraph>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}