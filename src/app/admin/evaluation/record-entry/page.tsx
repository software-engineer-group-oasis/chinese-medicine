// 评价记录录入页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Select from 'antd/es/select';
import Rate from 'antd/es/rate';
import Upload from 'antd/es/upload';
import DatePicker from 'antd/es/date-picker';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Breadcrumb from 'antd/es/breadcrumb';
import Steps from 'antd/es/steps';
import message from 'antd/es/message';
import Space from 'antd/es/space';
import Radio from 'antd/es/radio';
import InputNumber from 'antd/es/input-number';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Collapse from 'antd/es/collapse';
import { 
  ArrowLeftOutlined, InboxOutlined, SaveOutlined, 
  CheckOutlined, PictureOutlined, FileTextOutlined,
  UploadOutlined, PlusOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Panel } = Collapse;

export default function RecordEntryPage() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [herbSelected, setHerbSelected] = useState(false);
  const [evaluationTemplate, setEvaluationTemplate] = useState<{ id: string; name: string; version: string } | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  
  // 模拟药材列表数据
  const herbList = [
    { id: '1', name: '黄连', latinName: 'Coptis chinensis', origin: '重庆石柱' },
    { id: '2', name: '党参', latinName: 'Codonopsis pilosula', origin: '甘肃岷县' },
    { id: '3', name: '川芎', latinName: 'Ligusticum chuanxiong', origin: '四川都江堰' },
    { id: '4', name: '当归', latinName: 'Angelica sinensis', origin: '甘肃岷县' },
    { id: '5', name: '白芍', latinName: 'Paeonia lactiflora', origin: '安徽亳州' },
  ];
  
  // 模拟评价模板列表
  const templateList = [
    { id: '1', name: '通用中药材评价表', version: 'v2.1' },
    { id: '2', name: '道地药材专用评价表', version: 'v1.5' },
    { id: '3', name: '进口药材评价表', version: 'v1.0' },
  ];

  // 模拟评价维度数据
  const evaluationDimensions = [
    {
      name: '外观评价',
      type: 'rating',
      required: true,
      subItems: [
        { name: '色泽', description: '评价药材的颜色是否符合标准' },
        { name: '形状', description: '评价药材的形态是否完整、规则' },
        { name: '气味', description: '评价药材的气味是否纯正' },
        { name: '质地', description: '评价药材的质地是否坚实、细腻' },
      ]
    },
    {
      name: '成分含量',
      type: 'number',
      required: true,
      description: '药材有效成分的含量百分比，需要提供检测报告'
    },
    {
      name: '来源渠道',
      type: 'select',
      required: true,
      options: ['自有种植基地', '合作社', '市场采购', '其他来源'],
      description: '药材的来源渠道，影响药材的可追溯性和品质稳定性'
    },
    {
      name: '储存条件',
      type: 'select',
      required: false,
      options: ['常温干燥', '低温', '避光', '特殊环境'],
      description: '药材的储存条件，影响药材的保质期和有效成分稳定性'
    },
    {
      name: '其他说明',
      type: 'text',
      required: false,
      description: '其他需要说明的情况'
    },
  ];

  // 选择药材
  const handleHerbSelect = (value: string) => {
    setHerbSelected(true);
    message.success(`已选择药材：${herbList.find(herb => herb.id === value)?.name}`);
  };

  // 选择评价模板
  const handleTemplateSelect = (value: string) => {
    const template = templateList.find((t) => t.id === value) || null;
    setEvaluationTemplate(template);
    message.success(`已选择评价模板：${template?.name}`);
  };

  // 处理文件上传
  const handleFileUpload = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList);
  };

  // 提交表单
  const handleSubmit = (values: any) => {
    message.success('提交成功');
    // 这里可以添加API调用，保存评价记录到后端
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

  // 渲染评价表单项
  const renderFormItems = () => {
    return evaluationDimensions.map((dimension, index) => {
      if (dimension.type === 'rating' && dimension.subItems) {
        return (
          <Card key={index} className="mb-4" title={dimension.name}>
            {dimension.subItems.map((subItem, subIndex) => (
              <Form.Item
                key={`${index}-${subIndex}`}
                label={subItem.name}
                name={`rating_${subItem.name}`}
                tooltip={subItem.description}
                rules={[{ required: dimension.required, message: `请评价${subItem.name}!` }]}
              >
                <Rate allowHalf />
              </Form.Item>
            ))}
          </Card>
        );
      }
      
      switch (dimension.type) {
        case 'number':
          return (
            <Form.Item
              key={index}
              label={dimension.name}
              name={`number_${dimension.name}`}
              tooltip={dimension.description}
              rules={[{ required: dimension.required, message: `请输入${dimension.name}!` }]}
            >
              <InputNumber min={0} max={100} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
          );
        case 'select':
          return (
            <Form.Item
              key={index}
              label={dimension.name}
              name={`select_${dimension.name}`}
              tooltip={dimension.description}
              rules={[{ required: dimension.required, message: `请选择${dimension.name}!` }]}
            >
              <Select placeholder={`请选择${dimension.name}`}>
                {(dimension.options || []).map((option, optIndex) => (
                  <Option key={optIndex} value={option}>{option}</Option>
                ))}
              </Select>
            </Form.Item>
          );
        case 'text':
        default:
          return (
            <Form.Item
              key={index}
              label={dimension.name}
              name={`text_${dimension.name}`}
              tooltip={dimension.description}
              rules={[{ required: dimension.required, message: `请输入${dimension.name}!` }]}
            >
              <TextArea rows={4} placeholder={`请输入${dimension.name}`} />
            </Form.Item>
          );
      }
    });
  };

  // 步骤内容
  const steps = [
    {
      title: '选择药材',
      content: (
        <Card>
          <Form.Item
            label="药材选择"
            name="herb_id"
            rules={[{ required: true, message: '请选择要评价的药材!' }]}
          >
            <Select 
              placeholder="请选择要评价的药材"
              onChange={handleHerbSelect}
              showSearch
              optionFilterProp="children"
            >
              {herbList.map(herb => (
                <Option key={herb.id} value={herb.id}>
                  {herb.name} ({herb.latinName}) - {herb.origin}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {herbSelected && (
            <>
              <Divider />
              <Form.Item label="评价日期" name="evaluation_date" rules={[{ required: true, message: '请选择评价日期!' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item label="评价模板" name="template_id" rules={[{ required: true, message: '请选择评价模板!' }]}>
                <Select 
                  placeholder="请选择评价模板"
                  onChange={handleTemplateSelect}
                >
                  {templateList.map(template => (
                    <Option key={template.id} value={template.id}>
                      {template.name} ({template.version})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="批次编号" name="batch_number">
                <Input placeholder="请输入药材批次编号" />
              </Form.Item>

              <Form.Item label="评价人员" name="evaluator" rules={[{ required: true, message: '请输入评价人员!' }]}>
                <Input placeholder="请输入评价人员姓名" />
              </Form.Item>
            </>
          )}
        </Card>
      ),
    },
    {
      title: '填写评价',
      content: (
        <Card>
          {evaluationTemplate ? (
            <>
              <Paragraph className="mb-4">
                <Text strong>当前使用模板：</Text> {evaluationTemplate.name} ({evaluationTemplate.version})
              </Paragraph>
              {renderFormItems()}
            </>
          ) : (
            <div className="text-center p-6">
              <Text type="secondary">请先选择评价模板</Text>
            </div>
          )}
        </Card>
      ),
    },
    {
      title: '上传佐证',
      content: (
        <Card>
          <Form.Item label="佐证材料上传" name="evidence_files">
            <Upload.Dragger 
              multiple 
              listType="picture"
              fileList={fileList}
              onChange={handleFileUpload}
              beforeUpload={() => false} // 阻止自动上传
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传图片、PDF等文件作为评价佐证材料
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Divider>佐证材料说明</Divider>

          <Form.Item label="材料说明" name="evidence_description">
            <TextArea rows={4} placeholder="请输入佐证材料的相关说明" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="检测机构" name="testing_organization">
                <Input placeholder="请输入检测机构名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="检测报告编号" name="report_number">
                <Input placeholder="请输入检测报告编号" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      title: '确认提交',
      content: (
        <Card>
          <div className="text-center p-6">
            <CheckOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <Title level={3} className="mt-4">评价信息确认</Title>
            <Paragraph>
              请确认您填写的所有评价信息是否正确，提交后将生成正式的评价记录。
            </Paragraph>
          </div>

          <Collapse defaultActiveKey={['1']} className="mb-4">
            <Panel header="基本信息" key="1">
              <Form.Item label="药材名称">
                <div>{herbList.find(herb => herb.id === form.getFieldValue('herb_id'))?.name || '-'}</div>
              </Form.Item>
              <Form.Item label="评价模板">
                <div>{evaluationTemplate?.name || '-'}</div>
              </Form.Item>
              <Form.Item label="评价日期">
                <div>{form.getFieldValue('evaluation_date')?.format('YYYY-MM-DD') || '-'}</div>
              </Form.Item>
              <Form.Item label="评价人员">
                <div>{form.getFieldValue('evaluator') || '-'}</div>
              </Form.Item>
            </Panel>
            <Panel header="评价内容摘要" key="2">
              <p>外观评价: {form.getFieldValue('rating_色泽') ? `${form.getFieldValue('rating_色泽')}星` : '-'}</p>
              <p>成分含量: {form.getFieldValue('number_成分含量') ? `${form.getFieldValue('number_成分含量')}%` : '-'}</p>
              <p>来源渠道: {form.getFieldValue('select_来源渠道') || '-'}</p>
            </Panel>
            <Panel header="佐证材料" key="3">
              <p>上传文件数: {fileList.length}个</p>
              <p>材料说明: {form.getFieldValue('evidence_description') || '-'}</p>
            </Panel>
          </Collapse>

          <Form.Item name="comments" label="最终评语">
            <TextArea rows={4} placeholder="请输入对此次评价的总结性评语" />
          </Form.Item>
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
        <Breadcrumb.Item>评价记录录入</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>评价记录录入</Title>
      <Text type="secondary" className="block mb-6">填写打分、文字说明，上传图文材料佐证</Text>

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
          evaluation_date: null,
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
              提交评价
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}