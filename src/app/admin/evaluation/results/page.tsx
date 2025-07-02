// 结果查询与导出页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Breadcrumb from 'antd/es/breadcrumb';
import Tooltip from 'antd/es/tooltip';
import Dropdown from 'antd/es/dropdown';
import Statistic from 'antd/es/statistic';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Checkbox from 'antd/es/checkbox';
import Radio from 'antd/es/radio';
import Form from 'antd/es/form';
import Drawer from 'antd/es/drawer';
import Tabs from 'antd/es/tabs';
import { 
  ArrowLeftOutlined, SearchOutlined, FilterOutlined, 
  DownloadOutlined, FileExcelOutlined, FilePdfOutlined,
  PrinterOutlined, EyeOutlined, BarChartOutlined,
  PieChartOutlined, LineChartOutlined, ExportOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ReactEcharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { EVALUATION_COLUMNS } from '@/constants/evaluation';
import { evaluationRenderMap } from '@/constants/evaluationRenderMap';
import type { ColumnsType, ColumnType, ColumnGroupType } from 'antd/es/table';
import { getTableColumnRenders } from '@/utils/getTableColumnRenders';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function ResultsPage() {
  // 状态管理
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState({});
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [isStatDrawerVisible, setIsStatDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  // 模拟评价记录数据
  const [evaluationRecords, setEvaluationRecords] = useState([
    {
      id: '1',
      herbName: '黄连',
      evaluationDate: '2023-11-20',
      evaluator: '张医师',
      standardName: '通用中药材评价标准',
      standardVersion: 'v3.0',
      appearanceScore: 4.5,
      contentScore: 92,
      sourceChannel: '自有种植基地',
      storageCondition: '常温干燥',
      overallResult: '优秀',
      hasEvidence: true,
    },
    {
      id: '2',
      herbName: '党参',
      evaluationDate: '2023-11-18',
      evaluator: '李研究员',
      standardName: '通用中药材评价标准',
      standardVersion: 'v3.0',
      appearanceScore: 4.0,
      contentScore: 85,
      sourceChannel: '合作社',
      storageCondition: '低温',
      overallResult: '良好',
      hasEvidence: true,
    },
    {
      id: '3',
      herbName: '川芎',
      evaluationDate: '2023-11-15',
      evaluator: '王主任',
      standardName: '道地药材专用评价标准',
      standardVersion: 'v1.5',
      appearanceScore: 4.8,
      contentScore: 95,
      sourceChannel: '自有种植基地',
      storageCondition: '避光',
      overallResult: '优秀',
      hasEvidence: true,
    },
    {
      id: '4',
      herbName: '当归',
      evaluationDate: '2023-10-25',
      evaluator: '赵博士',
      standardName: '通用中药材评价标准',
      standardVersion: 'v2.5',
      appearanceScore: 3.5,
      contentScore: 78,
      sourceChannel: '市场采购',
      storageCondition: '常温干燥',
      overallResult: '合格',
      hasEvidence: false,
    },
    {
      id: '5',
      herbName: '白芍',
      evaluationDate: '2023-10-20',
      evaluator: '张医师',
      standardName: '通用中药材评价标准',
      standardVersion: 'v3.0',
      appearanceScore: 3.0,
      contentScore: 65,
      sourceChannel: '市场采购',
      storageCondition: '常温干燥',
      overallResult: '待改进',
      hasEvidence: true,
    },
    {
      id: '6',
      herbName: '黄芪',
      evaluationDate: '2023-10-15',
      evaluator: '李研究员',
      standardName: '通用中药材评价标准',
      standardVersion: 'v3.0',
      appearanceScore: 2.5,
      contentScore: 55,
      sourceChannel: '其他来源',
      storageCondition: '常温干燥',
      overallResult: '不合格',
      hasEvidence: false,
    },
  ]);

  // 处理行选择
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setIsFilterDrawerVisible(false);
    // 这里可以添加API调用，根据搜索条件获取评价记录
  };

  // 处理导出
  const handleExport = (type: string) => {
    if (selectedRowKeys.length === 0) {
      return;
    }
    
    const typeText = type === 'excel' ? 'Excel' : type === 'pdf' ? 'PDF' : '打印';
    console.log(`导出${selectedRowKeys.length}条记录为${typeText}格式`);
    // 这里可以添加导出逻辑
  };

  // 处理查看详情
  const handleViewDetail = (record: any) => {
    console.log('查看详情:', record);
    // 这里可以添加查看详情逻辑，如跳转到详情页或打开详情模态框
  };

  // 评价结果分布饼图配置
  const resultDistributionOption: EChartsOption = {
    title: {
      text: '评价结果分布',
      left: 'center',
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
        radius: '60%',
        center: ['50%', '50%'],
        data: [
          { value: 2, name: '优秀', itemStyle: { color: '#52c41a' } },
          { value: 1, name: '良好', itemStyle: { color: '#1677ff' } },
          { value: 1, name: '合格', itemStyle: { color: '#faad14' } },
          { value: 1, name: '待改进', itemStyle: { color: '#fa8c16' } },
          { value: 1, name: '不合格', itemStyle: { color: '#f5222d' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 评价指标雷达图配置
  const indicatorRadarOption: EChartsOption = {
    title: {
      text: '评价指标分析',
      left: 'center',
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        { name: '外观评分', max: 5 },
        { name: '成分含量', max: 100 },
        { name: '来源可靠性', max: 5 },
        { name: '储存条件', max: 5 },
        { name: '综合评价', max: 5 }
      ],
      radius: 120
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [4.5, 92, 5, 4, 4.8],
            name: '黄连',
            areaStyle: {
              color: 'rgba(82, 196, 26, 0.2)'
            },
            lineStyle: {
              color: '#52c41a'
            },
            itemStyle: {
              color: '#52c41a'
            }
          },
          {
            value: [4.0, 85, 4, 4, 4.2],
            name: '党参',
            areaStyle: {
              color: 'rgba(22, 119, 255, 0.2)'
            },
            lineStyle: {
              color: '#1677ff'
            },
            itemStyle: {
              color: '#1677ff'
            }
          },
          {
            value: [3.0, 65, 2, 3, 2.8],
            name: '白芍',
            areaStyle: {
              color: 'rgba(250, 173, 20, 0.2)'
            },
            lineStyle: {
              color: '#faad14'
            },
            itemStyle: {
              color: '#faad14'
            }
          }
        ]
      }
    ]
  };

  // 评价趋势折线图配置
  const trendLineOption: EChartsOption = {
    title: {
      text: '评价结果趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['外观评分', '成分含量'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['6月', '7月', '8月', '9月', '10月', '11月']
    },
    yAxis: [
      {
        type: 'value',
        name: '外观评分',
        min: 0,
        max: 5,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#1677ff'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '成分含量',
        min: 0,
        max: 100,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#52c41a'
          }
        },
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '外观评分',
        type: 'line',
        yAxisIndex: 0,
        data: [3.2, 3.5, 3.8, 4.0, 4.2, 4.5],
        itemStyle: {
          color: '#1677ff'
        },
        lineStyle: {
          width: 2
        },
        smooth: true
      },
      {
        name: '成分含量',
        type: 'line',
        yAxisIndex: 1,
        data: [65, 70, 75, 80, 85, 90],
        itemStyle: {
          color: '#52c41a'
        },
        lineStyle: {
          width: 2
        },
        smooth: true
      }
    ]
  };

  // 生成带 render 的 columns（通用工厂）
  const columns = getTableColumnRenders(EVALUATION_COLUMNS, evaluationRenderMap, {
    onViewDetail: handleViewDetail,
  });

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/evaluation"><ArrowLeftOutlined /> 中药评价与申报</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>结果查询与导出</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>结果查询与导出</Title>
      <Text type="secondary" className="block mb-6">条件筛选、批量导出评价记录</Text>

      <Card>
        {/* 搜索和操作工具栏 */}
        <div className="flex justify-between mb-4">
          <Space>
            <Input.Search 
              placeholder="搜索药材名称" 
              onSearch={(value) => console.log(value)} 
              style={{ width: 250 }}
            />
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setIsFilterDrawerVisible(true)}
            >
              高级筛选
            </Button>
            <Button 
              icon={<BarChartOutlined />} 
              onClick={() => setIsStatDrawerVisible(true)}
            >
              统计分析
            </Button>
          </Space>
          
          <Space>
            <Dropdown 
              menu={{
                items: [
                  {
                    key: 'excel',
                    label: 'Excel格式',
                    icon: <FileExcelOutlined />,
                    onClick: () => handleExport('excel')
                  },
                  {
                    key: 'pdf',
                    label: 'PDF格式',
                    icon: <FilePdfOutlined />,
                    onClick: () => handleExport('pdf')
                  },
                  {
                    key: 'print',
                    label: '打印',
                    icon: <PrinterOutlined />,
                    onClick: () => handleExport('print')
                  }
                ]
              }}
              disabled={selectedRowKeys.length === 0}
            >
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                导出所选 ({selectedRowKeys.length})
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* 数据表格 */}
        <Table 
          rowSelection={rowSelection} 
          columns={columns} 
          dataSource={evaluationRecords}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 高级筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        width={500}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button type="primary" onClick={() => form.submit()}>应用筛选</Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Form.Item name="herbName" label="药材名称">
            <Input placeholder="请输入药材名称" />
          </Form.Item>
          
          <Form.Item name="dateRange" label="评价日期范围">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="evaluator" label="评价人员">
            <Select placeholder="请选择评价人员" allowClear>
              <Option value="张医师">张医师</Option>
              <Option value="李研究员">李研究员</Option>
              <Option value="王主任">王主任</Option>
              <Option value="赵博士">赵博士</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="standard" label="评价标准">
            <Select placeholder="请选择评价标准" allowClear>
              <Option value="通用中药材评价标准 v3.0">通用中药材评价标准 v3.0</Option>
              <Option value="通用中药材评价标准 v2.5">通用中药材评价标准 v2.5</Option>
              <Option value="道地药材专用评价标准 v1.5">道地药材专用评价标准 v1.5</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="appearanceScoreRange" label="外观评分范围">
            <Radio.Group>
              <Radio value="all">全部</Radio>
              <Radio value="4.5-5">4.5-5分</Radio>
              <Radio value="4-4.5">4-4.5分</Radio>
              <Radio value="3-4">3-4分</Radio>
              <Radio value="0-3">3分以下</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item name="contentScoreRange" label="成分含量范围">
            <Radio.Group>
              <Radio value="all">全部</Radio>
              <Radio value="90-100">90%以上</Radio>
              <Radio value="80-90">80%-90%</Radio>
              <Radio value="70-80">70%-80%</Radio>
              <Radio value="0-70">70%以下</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item name="sourceChannel" label="来源渠道">
            <Checkbox.Group>
              <Row>
                <Col span={12}>
                  <Checkbox value="自有种植基地">自有种植基地</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="合作社">合作社</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="市场采购">市场采购</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="其他来源">其他来源</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          
          <Form.Item name="overallResult" label="评价结果">
            <Checkbox.Group>
              <Row>
                <Col span={12}>
                  <Checkbox value="优秀">优秀</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="良好">良好</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="合格">合格</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="待改进">待改进</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="不合格">不合格</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          
          <Form.Item name="hasEvidence" label="佐证材料">
            <Radio.Group>
              <Radio value="all">全部</Radio>
              <Radio value={true}>有</Radio>
              <Radio value={false}>无</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      {/* 统计分析抽屉 */}
      <Drawer
        title="统计分析"
        placement="right"
        onClose={() => setIsStatDrawerVisible(false)}
        open={isStatDrawerVisible}
        width={700}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="评价结果分布" key="1">
            <Card>
              <ReactEcharts option={resultDistributionOption} style={{ height: '400px' }} />
            </Card>
            
            <Row gutter={16} className="mt-4">
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="优秀率" 
                    value={33.3} 
                    suffix="%" 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="合格率" 
                    value={66.7} 
                    suffix="%" 
                    valueStyle={{ color: '#1677ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="不合格率" 
                    value={16.7} 
                    suffix="%" 
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="评价指标分析" key="2">
            <Card>
              <ReactEcharts option={indicatorRadarOption} style={{ height: '400px' }} />
            </Card>
          </TabPane>
          
          <TabPane tab="评价趋势分析" key="3">
            <Card>
              <ReactEcharts option={trendLineOption} style={{ height: '400px' }} />
            </Card>
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
}