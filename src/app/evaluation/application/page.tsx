// 申报材料联动页面
"use client"
import React, { useState } from 'react';
import { 
  Card, Form, Input, Button, Select, DatePicker, 
  Divider, Typography, Breadcrumb, Steps, message, Space,
  Radio, Checkbox, Row, Col, Table, Tag, Tabs, Upload,
  Collapse, List, Avatar, Modal, Tooltip, Dropdown, Menu,
  Progress, Badge, Timeline, Empty, Descriptions
} from 'antd';
import { 
  ArrowLeftOutlined, FileTextOutlined, DownloadOutlined, 
  CheckOutlined, FilePdfOutlined, FileWordOutlined,
  FileImageOutlined, UploadOutlined, PlusOutlined,
  EditOutlined, EyeOutlined, DeleteOutlined, SaveOutlined,
  PrinterOutlined, QuestionCircleOutlined, CameraOutlined,
  BarChartOutlined, LineChartOutlined, PieChartOutlined,
  ScanOutlined, CloudUploadOutlined, AuditOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function ApplicationPage() {
  // 状态管理
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedHerbs, setSelectedHerbs] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  
  // 模拟申报模板数据
  const applicationTemplates = [
    { id: '1', name: '非物质文化遗产申报模板', type: '国家级', lastUpdated: '2023-10-15' },
    { id: '2', name: '地理标志产品保护申报模板', type: '省级', lastUpdated: '2023-09-22' },
    { id: '3', name: '中药材品质认证申报模板', type: '行业标准', lastUpdated: '2023-11-05' },
    { id: '4', name: '道地药材认定申报模板', type: '国家级', lastUpdated: '2023-08-18' },
  ];
  
  // 模拟药材评价数据
  const herbEvaluations = [
    {
      id: '1',
      herbName: '黄连',
      latinName: 'Coptis chinensis',
      origin: '重庆石柱',
      evaluationCount: 56,
      averageScore: 4.7,
      lastEvaluated: '2023-11-20',
      qualityLevel: '优秀',
    },
    {
      id: '2',
      herbName: '党参',
      latinName: 'Codonopsis pilosula',
      origin: '甘肃岷县',
      evaluationCount: 42,
      averageScore: 4.2,
      lastEvaluated: '2023-11-18',
      qualityLevel: '良好',
    },
    {
      id: '3',
      herbName: '川芎',
      latinName: 'Ligusticum chuanxiong',
      origin: '四川都江堰',
      evaluationCount: 38,
      averageScore: 4.5,
      lastEvaluated: '2023-11-15',
      qualityLevel: '优秀',
    },
    {
      id: '4',
      herbName: '当归',
      latinName: 'Angelica sinensis',
      origin: '甘肃岷县',
      evaluationCount: 45,
      averageScore: 3.8,
      lastEvaluated: '2023-10-25',
      qualityLevel: '良好',
    },
  ];

  // 模拟申报要求数据
  const applicationRequirements = [
    { id: '1', name: '基本信息', required: true, description: '包括药材名称、产地、历史沿革等基本信息' },
    { id: '2', name: '质量评价报告', required: true, description: '药材质量评价的详细报告，包括外观、成分等维度' },
    { id: '3', name: '生产工艺', required: true, description: '药材的种植、采收、加工等工艺流程' },
    { id: '4', name: '特色与价值', required: true, description: '药材的特色、价值及其在医药学上的意义' },
    { id: '5', name: '历史文献', required: false, description: '相关历史文献记载及考证' },
    { id: '6', name: '图片资料', required: true, description: '药材外观、生长环境、加工过程等图片' },
    { id: '7', name: '检测报告', required: true, description: '权威机构出具的检测报告' },
    { id: '8', name: '专家意见', required: false, description: '行业专家对药材质量的评价意见' },
  ];

  // 处理模板选择
  const handleTemplateSelect = (templateId) => {
    const template = applicationTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template);
    message.success(`已选择申报模板：${template?.name}`);
  };

  // 处理药材选择
  const handleHerbSelect = (selectedRowKeys) => {
    setSelectedHerbs(selectedRowKeys);
  };

  // 处理文件上传
  const handleFileUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  // 处理表单提交
  const handleSubmit = (values) => {
    console.log('表单提交数据:', values);
    message.success('申报材料已生成');
    // 这里可以添加API调用，生成申报材料
  };

  // 下一步
  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(error => {
      console.log('表单验证失败:', error);
    });
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 预览申报材料
  const handlePreview = () => {
    setPreviewVisible(true);
  };

  // 下载申报材料
  const handleDownload = (format) => {
    message.success(`申报材料已生成，正在下载${format}格式文件`);
    // 这里可以添加下载逻辑
  };

  // 药材选择表格列定义
  const herbColumns = [
    {
      title: '药材名称',
      dataIndex: 'herbName',
      key: 'herbName',
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          <Text type="secondary">({record.latinName})</Text>
        </Space>
      ),
    },
    {
      title: '产地',
      dataIndex: 'origin',
      key: 'origin',
    },
    {
      title: '评价次数',
      dataIndex: 'evaluationCount',
      key: 'evaluationCount',
    },
    {
      title: '平均评分',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score) => {
        let color = '';
        if (score >= 4.5) color = '#52c41a';
        else if (score >= 4.0) color = '#1677ff';
        else if (score >= 3.0) color = '#faad14';
        else color = '#f5222d';
        
        return <Text style={{ color }}>{score}</Text>;
      },
    },
    {
      title: '质量等级',
      dataIndex: 'qualityLevel',
      key: 'qualityLevel',
      render: (text) => {
        let color = '';
        switch (text) {
          case '优秀':
            color = 'green';
            break;
          case '良好':
            color = 'blue';
            break;
          case '合格':
            color = 'orange';
            break;
          case '待改进':
            color = 'volcano';
            break;
          case '不合格':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最近评价',
      dataIndex: 'lastEvaluated',
      key: 'lastEvaluated',
    },
  ];

  // 步骤内容
  const steps = [
    {
      title: '选择模板',
      content: (
        <Card>
          <Form.Item
            label="申报类型"
            name="applicationType"
            rules={[{ required: true, message: '请选择申报类型!' }]}
          >
            <Radio.Group>
              <Radio value="heritage">非物质文化遗产</Radio>
              <Radio value="geographical">地理标志产品</Radio>
              <Radio value="quality">中药材品质认证</Radio>
              <Radio value="authentic">道地药材认定</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="申报级别"
            name="applicationLevel"
            rules={[{ required: true, message: '请选择申报级别!' }]}
          >
            <Radio.Group>
              <Radio value="national">国家级</Radio>
              <Radio value="provincial">省级</Radio>
              <Radio value="municipal">市级</Radio>
              <Radio value="industry">行业标准</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="申报模板"
            name="templateId"
            rules={[{ required: true, message: '请选择申报模板!' }]}
          >
            <Select 
              placeholder="请选择申报模板"
              onChange={handleTemplateSelect}
            >
              {applicationTemplates.map(template => (
                <Option key={template.id} value={template.id}>
                  {template.name} ({template.type})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedTemplate && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <Title level={5}>模板要求</Title>
              <List
                size="small"
                dataSource={applicationRequirements}
                renderItem={item => (
                  <List.Item>
                    <Space>
                      {item.required ? 
                        <Tag color="red">必填</Tag> : 
                        <Tag color="default">选填</Tag>
                      }
                      <Text strong>{item.name}</Text>
                    </Space>
                    <Text type="secondary">{item.description}</Text>
                  </List.Item>
                )}
              />
            </div>
          )}
        </Card>
      ),
    },
    {
      title: '选择药材',
      content: (
        <Card>
          <Paragraph className="mb-4">
            请选择需要申报的药材，可以选择多个药材进行批量申报。
          </Paragraph>

          <Table 
            rowSelection={{
              type: 'checkbox',
              onChange: handleHerbSelect,
            }}
            columns={herbColumns} 
            dataSource={herbEvaluations}
            rowKey="id"
          />

          {selectedHerbs.length > 0 && (
            <div className="mt-4">
              <Text strong>已选择 {selectedHerbs.length} 种药材</Text>
            </div>
          )}
        </Card>
      ),
    },
    {
      title: '填写信息',
      content: (
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Form.Item
                label="申报单位"
                name="organization"
                rules={[{ required: true, message: '请输入申报单位!' }]}
              >
                <Input placeholder="请输入申报单位名称" />
              </Form.Item>

              <Form.Item
                label="申报日期"
                name="applicationDate"
                rules={[{ required: true, message: '请选择申报日期!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="联系人"
                name="contactPerson"
                rules={[{ required: true, message: '请输入联系人姓名!' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="联系电话"
                    name="contactPhone"
                    rules={[{ required: true, message: '请输入联系电话!' }]}
                  >
                    <Input placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="电子邮箱"
                    name="contactEmail"
                    rules={[{ required: true, message: '请输入电子邮箱!' }]}
                  >
                    <Input placeholder="请输入电子邮箱" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="申报说明" key="2">
              <Form.Item
                label={
                  <span>
                    历史沿革
                    <Tooltip title="药材的历史起源、发展过程和重要历史事件">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="history"
                rules={[{ required: true, message: '请输入历史沿革!' }]}
              >
                <TextArea rows={4} placeholder="请描述药材的历史沿革" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    特色与价值
                    <Tooltip title="药材的特色、价值及其在医药学上的意义">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="value"
                rules={[{ required: true, message: '请输入特色与价值!' }]}
              >
                <TextArea rows={4} placeholder="请描述药材的特色与价值" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    生产工艺
                    <Tooltip title="药材的种植、采收、加工等工艺流程">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="process"
                rules={[{ required: true, message: '请输入生产工艺!' }]}
              >
                <TextArea rows={4} placeholder="请描述药材的生产工艺" />
              </Form.Item>
            </TabPane>

            <TabPane tab="材料上传" key="3">
              <Form.Item
                label="图片资料"
                name="images"
                rules={[{ required: true, message: '请上传图片资料!' }]}
              >
                <Upload.Dragger 
                  multiple 
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileUpload}
                  beforeUpload={() => false} // 阻止自动上传
                >
                  <p className="ant-upload-drag-icon">
                    <FileImageOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">
                    支持上传药材外观、生长环境、加工过程等图片
                  </p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item
                label="检测报告"
                name="reports"
                rules={[{ required: true, message: '请上传检测报告!' }]}
              >
                <Upload
                  multiple
                  listType="text"
                  beforeUpload={() => false} // 阻止自动上传
                >
                  <Button icon={<UploadOutlined />}>上传检测报告</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="其他材料"
                name="otherMaterials"
              >
                <Upload
                  multiple
                  listType="text"
                  beforeUpload={() => false} // 阻止自动上传
                >
                  <Button icon={<UploadOutlined />}>上传其他材料</Button>
                </Upload>
              </Form.Item>
            </TabPane>
            
            <TabPane tab="评价过程记录" key="6">
              <div className="bg-orange-50 p-4 mb-4 rounded">
                <Title level={5}>
                  <AuditOutlined /> 评价过程跟踪记录
                </Title>
                <Text>记录中药材评价的全过程，确保评价透明可追溯，支持评价结果的可靠性</Text>
              </div>
              
              <Card title="评价进度" className="mb-4">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    {selectedHerbs.length > 0 ? (
                      herbEvaluations
                        .filter(herb => selectedHerbs.includes(herb.id))
                        .map(herb => (
                          <Card key={herb.id} size="small" className="mb-2" title={herb.herbName}>
                            <Row align="middle">
                              <Col span={18}>
                                <Progress 
                                  percent={herb.evaluationProgress} 
                                  status={herb.evaluationProgress === 100 ? 'success' : 'active'}
                                  format={percent => (
                                    <span>
                                      {percent}% 
                                      <Text type="secondary" style={{ fontSize: '12px' }}>
                                        ({herb.evaluationStatus})
                                      </Text>
                                    </span>
                                  )}
                                />
                              </Col>
                              <Col span={6} className="text-right">
                                <Tag color={herb.evaluationProgress === 100 ? 'green' : 'blue'}>
                                  {herb.evaluationProgress === 100 ? '已完成' : '进行中'}
                                </Tag>
                              </Col>
                            </Row>
                          </Card>
                        ))
                    ) : (
                      <Empty description="请先选择药材" />
                    )}
                  </Col>
                </Row>
              </Card>
              
              <Card title="评价记录" className="mb-4">
                <Timeline mode="left">
                  <Timeline.Item label="2023-12-10 09:30" color="green">
                    <p><Text strong>初步评价</Text></p>
                    <p>完成药材外观评价，记录色泽、形状等特征</p>
                    <p><Text type="secondary">评价人: 张医师</Text></p>
                  </Timeline.Item>
                  <Timeline.Item label="2023-12-11 14:20" color="blue">
                    <p><Text strong>成分检测</Text></p>
                    <p>完成有效成分含量检测，符合标准要求</p>
                    <p><Text type="secondary">检测机构: 中药材检测中心</Text></p>
                  </Timeline.Item>
                  <Timeline.Item label="2023-12-12 10:15" color="blue">
                    <p><Text strong>专家评审</Text></p>
                    <p>专家组评审通过，认为符合道地药材特征</p>
                    <p><Text type="secondary">专家组长: 李教授</Text></p>
                  </Timeline.Item>
                  <Timeline.Item label="2023-12-15 16:40" color="red">
                    <p><Text strong>评价完成</Text></p>
                    <p>综合评价结果: 优秀</p>
                    <p><Text type="secondary">评价编号: EV20231215-086</Text></p>
                  </Timeline.Item>
                </Timeline>
              </Card>
              
              <Card title="评价文档" extra={<Button type="primary" icon={<DownloadOutlined />}>导出记录</Button>}>
                <List
                  size="small"
                  dataSource={[
                    { title: '初步评价表', date: '2023-12-10', type: 'pdf' },
                    { title: '成分检测报告', date: '2023-12-11', type: 'pdf' },
                    { title: '专家评审意见', date: '2023-12-12', type: 'docx' },
                    { title: '综合评价报告', date: '2023-12-15', type: 'pdf' },
                  ]}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button type="link" key="view" icon={<EyeOutlined />}>查看</Button>,
                        <Button type="link" key="download" icon={<DownloadOutlined />}>下载</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          item.type === 'pdf' ? <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /> : 
                          item.type === 'docx' ? <FileWordOutlined style={{ fontSize: '24px', color: '#1890ff' }} /> : 
                          <FileTextOutlined style={{ fontSize: '24px' }} />
                        }
                        title={item.title}
                        description={`生成日期: ${item.date}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      ),
    },
    {
      title: '生成材料',
      content: (
        <Card>
          <div className="text-center p-6">
            <CheckOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <Title level={3} className="mt-4">申报材料生成</Title>
            <Paragraph>
              系统将根据您提供的信息和评价数据，自动生成申报材料。
            </Paragraph>
          </div>

          <Collapse defaultActiveKey={['1']} className="mb-4">
            <Panel header="申报信息摘要" key="1">
              <Form.Item label="申报类型">
                <div>{form.getFieldValue('applicationType') === 'heritage' ? '非物质文化遗产' : 
                      form.getFieldValue('applicationType') === 'geographical' ? '地理标志产品' :
                      form.getFieldValue('applicationType') === 'quality' ? '中药材品质认证' :
                      form.getFieldValue('applicationType') === 'authentic' ? '道地药材认定' : '-'}</div>
              </Form.Item>
              <Form.Item label="申报模板">
                <div>{selectedTemplate?.name || '-'}</div>
              </Form.Item>
              <Form.Item label="申报药材">
                <div>{selectedHerbs.length > 0 ? 
                  herbEvaluations
                    .filter(herb => selectedHerbs.includes(herb.id))
                    .map(herb => herb.herbName)
                    .join('、') : '-'}</div>
              </Form.Item>
              <Form.Item label="申报单位">
                <div>{form.getFieldValue('organization') || '-'}</div>
              </Form.Item>
            </Panel>
            <Panel header="评价数据摘要" key="2">
              <Table 
                columns={[
                  { title: '药材名称', dataIndex: 'herbName', key: 'herbName' },
                  { title: '评价次数', dataIndex: 'evaluationCount', key: 'evaluationCount' },
                  { title: '平均评分', dataIndex: 'averageScore', key: 'averageScore' },
                  { 
                    title: '质量等级', 
                    dataIndex: 'qualityLevel', 
                    key: 'qualityLevel',
                    render: (text) => {
                      const color = text === '优秀' ? 'green' : text === '良好' ? 'blue' : 'orange';
                      return <Tag color={color}>{text}</Tag>;
                    }
                  },
                ]} 
                dataSource={herbEvaluations.filter(herb => selectedHerbs.includes(herb.id))}
                rowKey="id"
                pagination={false}
              />
            </Panel>
          </Collapse>

          <div className="flex justify-center mt-6">
            <Space size="large">
              <Button 
                type="primary" 
                icon={<EyeOutlined />} 
                onClick={handlePreview}
              >
                预览申报材料
              </Button>
              <Dropdown 
                menu={{
                  items: [
                    {
                      key: 'word',
                      label: 'Word格式',
                      icon: <FileWordOutlined />,
                      onClick: () => handleDownload('Word')
                    },
                    {
                      key: 'pdf',
                      label: 'PDF格式',
                      icon: <FilePdfOutlined />,
                      onClick: () => handleDownload('PDF')
                    },
                    {
                      key: 'print',
                      label: '打印',
                      icon: <PrinterOutlined />,
                      onClick: () => handleDownload('打印')
                    }
                  ]
                }}
              >
                <Button icon={<DownloadOutlined />}>
                  导出申报材料
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/evaluation"><ArrowLeftOutlined /> 中药评价与申报</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>申报材料联动</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>申报材料联动</Title>
      <Text type="secondary" className="block mb-6">从评价数据生成申报用的报告模板</Text>

      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          applicationDate: null,
        }}
      >
        <div className="steps-content">{steps[currentStep].content}</div>
        
        <div className="steps-action mt-6 flex justify-between">
          {currentStep > 0 && (
            <Button onClick={prevStep}>
              上一步
            </Button>
          )}
          
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={nextStep}>
              下一步
            </Button>
          )}
          
          {currentStep === steps.length - 1 && (
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              完成
            </Button>
          )}
        </div>
      </Form>

      {/* 预览模态框 */}
      <Modal
        title="申报材料预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => {
              handleDownload('PDF');
              setPreviewVisible(false);
            }}
          >
            下载PDF
          </Button>,
        ]}
        width={800}
      >
        <div className="p-4 border rounded">
          <div className="text-center mb-6">
            <Title level={3}>{selectedTemplate?.name || '申报材料'}</Title>
            <Text type="secondary">申报单位：{form.getFieldValue('organization') || '未指定'}</Text>
          </div>

          <Divider orientation="left">基本信息</Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>申报类型：</Text>
              <Text>{form.getFieldValue('applicationType') === 'heritage' ? '非物质文化遗产' : 
                    form.getFieldValue('applicationType') === 'geographical' ? '地理标志产品' :
                    form.getFieldValue('applicationType') === 'quality' ? '中药材品质认证' :
                    form.getFieldValue('applicationType') === 'authentic' ? '道地药材认定' : '-'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>申报级别：</Text>
              <Text>{form.getFieldValue('applicationLevel') === 'national' ? '国家级' : 
                    form.getFieldValue('applicationLevel') === 'provincial' ? '省级' :
                    form.getFieldValue('applicationLevel') === 'municipal' ? '市级' :
                    form.getFieldValue('applicationLevel') === 'industry' ? '行业标准' : '-'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>联系人：</Text>
              <Text>{form.getFieldValue('contactPerson') || '-'}</Text>
            </Col>
            <Col span={12}>
              <Text strong>联系电话：</Text>
              <Text>{form.getFieldValue('contactPhone') || '-'}</Text>
            </Col>
          </Row>

          <Divider orientation="left">药材信息</Divider>
          <Table 
            columns={[
              { title: '药材名称', dataIndex: 'herbName', key: 'herbName' },
              { title: '拉丁名', dataIndex: 'latinName', key: 'latinName' },
              { title: '产地', dataIndex: 'origin', key: 'origin' },
              { title: '质量等级', dataIndex: 'qualityLevel', key: 'qualityLevel',
                render: (text) => {
                  const color = text === '优秀' ? 'green' : text === '良好' ? 'blue' : 'orange';
                  return <Tag color={color}>{text}</Tag>;
                }
              },
            ]} 
            dataSource={herbEvaluations.filter(herb => selectedHerbs.includes(herb.id))}
            rowKey="id"
            pagination={false}
          />

          <Divider orientation="left">申报说明</Divider>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="历史沿革" key="1">
              <Paragraph>
                {form.getFieldValue('history') || '暂无内容'}
              </Paragraph>
            </Panel>
            <Panel header="特色与价值" key="2">
              <Paragraph>
                {form.getFieldValue('value') || '暂无内容'}
              </Paragraph>
            </Panel>
            <Panel header="生产工艺" key="3">
              <Paragraph>
                {form.getFieldValue('process') || '暂无内容'}
              </Paragraph>
            </Panel>
          </Collapse>

          <Divider orientation="left">评价数据摘要</Divider>
          <Paragraph>
            根据系统中的评价数据，所选药材共进行了 
            {herbEvaluations
              .filter(herb => selectedHerbs.includes(herb.id))
              .reduce((sum, herb) => sum + herb.evaluationCount, 0)} 次评价，
            平均质量等级为 
            {herbEvaluations
              .filter(herb => selectedHerbs.includes(herb.id))
              .some(herb => herb.qualityLevel === '优秀') ? '优秀' : '良好'}。
          </Paragraph>

          <div className="text-center mt-6 text-gray-400">
            <Text>- 申报材料预览结束 -</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}