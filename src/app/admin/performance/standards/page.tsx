// 评分标准管理页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Breadcrumb from 'antd/es/breadcrumb';
import Tooltip from 'antd/es/tooltip';
import Form from 'antd/es/form';
import Modal from 'antd/es/modal';
import InputNumber from 'antd/es/input-number';
import message from 'antd/es/message';
import Popconfirm from 'antd/es/popconfirm';
import Tabs from 'antd/es/tabs';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { 
  ArrowLeftOutlined, PlusOutlined, EditOutlined, 
  DeleteOutlined, SaveOutlined, CloseOutlined,
  QuestionCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
// 导入模拟数据
import { 
  mockScoreStandards, 
  mockPerformanceTypes
} from '@/mock/performance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 定义评分标准类型
interface ScoreCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface ScoreStandard {
  id: string;
  typeId: string;
  typeName: string;
  version: string;
  effectiveDate: string;
  status: 'active' | 'inactive';
  criteria: ScoreCriterion[];
}

export default function PerformanceStandardsPage() {
  // 状态管理
  const [standards, setStandards] = useState<ScoreStandard[]>(mockScoreStandards);
  const [selectedStandard, setSelectedStandard] = useState<ScoreStandard | null>(null);
  const [isStandardModalVisible, setIsStandardModalVisible] = useState(false);
  const [isCriterionModalVisible, setIsCriterionModalVisible] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<ScoreCriterion | null>(null);
  const [activeTab, setActiveTab] = useState(mockPerformanceTypes[0]?.id || '');
  const [standardForm] = Form.useForm();
  const [criterionForm] = Form.useForm();

  // 处理标准选择
  const handleSelectStandard = (standard: ScoreStandard) => {
    setSelectedStandard(standard);
  };

  // 处理添加新标准
  const handleAddStandard = () => {
    setSelectedStandard(null);
    standardForm.resetFields();
    standardForm.setFieldsValue({
      typeId: activeTab,
      typeName: mockPerformanceTypes.find(type => type.id === activeTab)?.name,
      status: 'active',
      version: `V${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`,
      effectiveDate: new Date().toISOString().split('T')[0]
    });
    setIsStandardModalVisible(true);
  };

  // 处理编辑标准
  const handleEditStandard = (standard: ScoreStandard) => {
    setSelectedStandard(standard);
    standardForm.setFieldsValue({
      ...standard
    });
    setIsStandardModalVisible(true);
  };

  // 处理删除标准
  const handleDeleteStandard = (standardId: string) => {
    setStandards(standards.filter(s => s.id !== standardId));
    message.success('评分标准已删除');
    if (selectedStandard?.id === standardId) {
      setSelectedStandard(null);
    }
  };

  // 处理保存标准
  const handleSaveStandard = () => {
    standardForm.validateFields().then(values => {
      const newStandard: ScoreStandard = {
        id: selectedStandard?.id || `standard-${Date.now()}`,
        typeId: values.typeId,
        typeName: values.typeName,
        version: values.version,
        effectiveDate: values.effectiveDate,
        status: values.status,
        criteria: selectedStandard?.criteria || []
      };
      
      if (selectedStandard) {
        // 更新现有标准
        setStandards(standards.map(s => s.id === selectedStandard.id ? newStandard : s));
        message.success('评分标准已更新');
      } else {
        // 添加新标准
        setStandards([...standards, newStandard]);
        message.success('评分标准已创建');
      }
      
      setIsStandardModalVisible(false);
      setSelectedStandard(newStandard);
    });
  };

  // 处理添加评分项
  const handleAddCriterion = () => {
    setEditingCriterion(null);
    criterionForm.resetFields();
    setIsCriterionModalVisible(true);
  };

  // 处理编辑评分项
  const handleEditCriterion = (criterion: ScoreCriterion) => {
    setEditingCriterion(criterion);
    criterionForm.setFieldsValue({
      ...criterion
    });
    setIsCriterionModalVisible(true);
  };

  // 处理删除评分项
  const handleDeleteCriterion = (criterionId: string) => {
    if (!selectedStandard) return;
    
    const updatedCriteria = selectedStandard.criteria.filter(c => c.id !== criterionId);
    const updatedStandard = {
      ...selectedStandard,
      criteria: updatedCriteria
    };
    
    setStandards(standards.map(s => s.id === selectedStandard.id ? updatedStandard : s));
    setSelectedStandard(updatedStandard);
    message.success('评分项已删除');
  };

  // 处理保存评分项
  const handleSaveCriterion = () => {
    criterionForm.validateFields().then(values => {
      if (!selectedStandard) return;
      
      const criterion: ScoreCriterion = {
        id: editingCriterion?.id || `criterion-${Date.now()}`,
        name: values.name,
        description: values.description,
        weight: values.weight
      };
      
      let updatedCriteria;
      if (editingCriterion) {
        // 更新现有评分项
        updatedCriteria = selectedStandard.criteria.map(c => 
          c.id === editingCriterion.id ? criterion : c
        );
        message.success('评分项已更新');
      } else {
        // 添加新评分项
        updatedCriteria = [...selectedStandard.criteria, criterion];
        message.success('评分项已添加');
      }
      
      // 检查权重总和是否超过1
      const totalWeight = updatedCriteria.reduce((sum, c) => sum + c.weight, 0);
      if (totalWeight > 1) {
        message.warning('所有评分项权重总和超过了100%，请调整');
      }
      
      const updatedStandard = {
        ...selectedStandard,
        criteria: updatedCriteria
      };
      
      setStandards(standards.map(s => s.id === selectedStandard.id ? updatedStandard : s));
      setSelectedStandard(updatedStandard);
      setIsCriterionModalVisible(false);
    });
  };

  // 获取当前标签页的标准
  const getTabStandards = () => {
    return standards.filter(standard => standard.typeId === activeTab);
  };

  // 标准表格列定义
  const standardColumns = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '生效中' : '已停用'}
        </Tag>
      )
    },
    {
      title: '评分项数量',
      key: 'criteriaCount',
      render: (_: any, record: ScoreStandard) => record.criteria.length
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ScoreStandard) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditStandard(record)} 
          />
          <Popconfirm
            title="确定要删除此评分标准吗？"
            onConfirm={() => handleDeleteStandard(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 评分项表格列定义
  const criterionColumns = [
    {
      title: '评分项名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => `${weight * 100}%`
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ScoreCriterion) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditCriterion(record)} 
          />
          <Popconfirm
            title="确定要删除此评分项吗？"
            onConfirm={() => handleDeleteCriterion(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>评分标准管理</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>评分标准管理</Title>
      <Text type="secondary" className="block mb-6">管理不同类型业绩的评分标准和权重</Text>

      <Row gutter={24}>
        <Col span={10}>
          <Card title="评分标准列表" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddStandard}>新建标准</Button>}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
              {mockPerformanceTypes.map(type => (
                <TabPane tab={type.name} key={type.id} />
              ))}
            </Tabs>
            
            <Table 
              columns={standardColumns} 
              dataSource={getTabStandards()}
              rowKey="id"
              pagination={false}
              rowClassName={(record) => record.id === selectedStandard?.id ? 'bg-blue-50' : ''}
              onRow={(record) => ({
                onClick: () => handleSelectStandard(record),
              })}
            />
          </Card>
        </Col>
        
        <Col span={14}>
          <Card 
            title={selectedStandard ? `${selectedStandard.typeName} - ${selectedStandard.version} 评分项` : '评分项详情'}
            extra={
              selectedStandard && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCriterion}>添加评分项</Button>
              )
            }
          >
            {selectedStandard ? (
              <>
                <div className="mb-4">
                  <Space>
                    <Tag color={selectedStandard.status === 'active' ? 'green' : 'default'}>
                      {selectedStandard.status === 'active' ? '生效中' : '已停用'}
                    </Tag>
                    <Text type="secondary">生效日期: {selectedStandard.effectiveDate}</Text>
                  </Space>
                </div>
                
                <Table 
                  columns={criterionColumns} 
                  dataSource={selectedStandard.criteria}
                  rowKey="id"
                  pagination={false}
                />
                
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <Space>
                    <InfoCircleOutlined />
                    <Text>所有评分项权重总和: {Math.round(selectedStandard.criteria.reduce((sum, c) => sum + c.weight, 0) * 100)}%</Text>
                    {selectedStandard.criteria.reduce((sum, c) => sum + c.weight, 0) > 1 && (
                      <Tag color="warning">超过100%</Tag>
                    )}
                    {selectedStandard.criteria.reduce((sum, c) => sum + c.weight, 0) < 1 && (
                      <Tag color="warning">低于100%</Tag>
                    )}
                  </Space>
                </div>
              </>
            ) : (
              <div className="text-center p-10">
                <Text type="secondary">请从左侧选择一个评分标准，或创建新标准</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 标准编辑模态框 */}
      <Modal
        title={selectedStandard ? '编辑评分标准' : '新建评分标准'}
        open={isStandardModalVisible}
        onCancel={() => setIsStandardModalVisible(false)}
        footer={null}
      >
        <Form
          form={standardForm}
          layout="vertical"
          onFinish={handleSaveStandard}
        >
          <Form.Item
            name="typeId"
            label="业绩类型"
            rules={[{ required: true, message: '请选择业绩类型' }]}
          >
            <Select disabled={!!selectedStandard}>
              {mockPerformanceTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="typeName"
            hidden
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如：V2023.1.0" />
          </Form.Item>
          
          <Form.Item
            name="effectiveDate"
            label="生效日期"
            rules={[{ required: true, message: '请输入生效日期' }]}
          >
            <Input type="date" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="active">生效中</Option>
              <Option value="inactive">已停用</Option>
            </Select>
          </Form.Item>
          
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsStandardModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {selectedStandard ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 评分项编辑模态框 */}
      <Modal
        title={editingCriterion ? '编辑评分项' : '添加评分项'}
        open={isCriterionModalVisible}
        onCancel={() => setIsCriterionModalVisible(false)}
        footer={null}
      >
        <Form
          form={criterionForm}
          layout="vertical"
          onFinish={handleSaveCriterion}
        >
          <Form.Item
            name="name"
            label="评分项名称"
            rules={[{ required: true, message: '请输入评分项名称' }]}
          >
            <Input placeholder="例如：教学质量" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请描述此评分项的评分标准和要求" />
          </Form.Item>
          
          <Form.Item
            name="weight"
            label={
              <span>
                权重 
                <Tooltip title="所有评分项的权重总和应为100%">
                  <QuestionCircleOutlined className="ml-1" />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '请输入权重' }]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.05}
              precision={2}
              formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
              parser={(value) => value ? Number(value.replace('%', '')) / 100 : 0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsCriterionModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingCriterion ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}