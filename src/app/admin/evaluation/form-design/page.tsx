// 评价表单自定义页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Select from 'antd/es/select';
import InputNumber from 'antd/es/input-number';
import Switch from 'antd/es/switch';
import Table from 'antd/es/table';
import Popconfirm from 'antd/es/popconfirm';
import message from 'antd/es/message';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Breadcrumb from 'antd/es/breadcrumb';
import Tabs from 'antd/es/tabs';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, 
  SaveOutlined, EyeOutlined, ArrowLeftOutlined 
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function FormDesignPage() {
  // 表单设计状态
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [formName, setFormName] = useState('中药材质量评价表');
  const [formDescription, setFormDescription] = useState('用于评估中药材的质量、外观、成分含量等指标');
  
  // 评价维度数据
  const [dimensions, setDimensions] = useState([
    {
      key: '1',
      name: '外观评价',
      type: 'rating',
      required: true,
      options: '色泽,形状,气味,质地',
      weight: 30,
      description: '评价药材的外观特征，包括色泽、形状、气味和质地等方面'
    },
    {
      key: '2',
      name: '成分含量',
      type: 'number',
      required: true,
      options: '',
      weight: 40,
      description: '药材有效成分的含量百分比，需要提供检测报告'
    },
    {
      key: '3',
      name: '来源渠道',
      type: 'select',
      required: true,
      options: '自有种植基地,合作社,市场采购,其他来源',
      weight: 15,
      description: '药材的来源渠道，影响药材的可追溯性和品质稳定性'
    },
    {
      key: '4',
      name: '储存条件',
      type: 'select',
      required: false,
      options: '常温干燥,低温,避光,特殊环境',
      weight: 15,
      description: '药材的储存条件，影响药材的保质期和有效成分稳定性'
    },
  ]);

  // 表单模板列表
  const [templates, setTemplates] = useState([
    { id: '1', name: '通用中药材评价表', dimensionCount: 5, createTime: '2023-06-15', status: 'active' },
    { id: '2', name: '道地药材专用评价表', dimensionCount: 8, createTime: '2023-08-22', status: 'active' },
    { id: '3', name: '进口药材评价表', dimensionCount: 6, createTime: '2023-10-05', status: 'draft' },
  ]);

  // 是否可编辑
  const isEditing = (record: any) => record.key === editingKey;

  // 开始编辑
  const edit = (record: any) => {
    form.setFieldsValue({
      name: '',
      type: '',
      required: '',
      options: '',
      weight: '',
      description: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  // 取消编辑
  const cancel = () => {
    setEditingKey('');
  };

  // 保存编辑
  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as any;
      const newData = [...dimensions];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDimensions(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDimensions(newData);
        setEditingKey('');
      }
      message.success('评价维度已更新');
    } catch (err) {
      message.error('保存失败');
    }
  };

  // 删除维度
  const handleDelete = (key: string) => {
    setDimensions(dimensions.filter((item) => item.key !== key));
    message.success('评价维度已删除');
  };

  // 添加新维度
  const handleAdd = () => {
    const newKey = (dimensions.length + 1).toString();
    const newDimension = {
      key: newKey,
      name: `新评价维度`,
      type: 'text',
      required: false,
      options: '',
      weight: 10,
      description: '请描述此评价维度的用途'
    };
    setDimensions([...dimensions, newDimension]);
    edit(newDimension);
  };

  // 保存表单设计
  const handleSaveForm = () => {
    // 这里可以添加API调用，保存表单设计到后端
    message.success('表单设计已保存');
  };

  // 预览表单
  const handlePreview = () => {
    message.info('表单预览功能正在开发中');
  };

  // 表格列定义
  const columns = [
    {
      title: '维度名称',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '15%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      editable: true,
      width: '12%',
      render: (_: any, record: any) => {
        const typeMap = {
          'text': '文本',
          'number': '数值',
          'select': '选择',
          'rating': '评分',
          'upload': '上传'
        };
        return typeMap[record.type as keyof typeof typeMap] || record.type;
      },
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      editable: true,
      width: '8%',
      render: (required: boolean) => required ? '是' : '否',
    },
    {
      title: '选项',
      dataIndex: 'options',
      key: 'options',
      editable: true,
      width: '15%',
      ellipsis: true,
    },
    {
      title: '权重(%)',
      dataIndex: 'weight',
      key: 'weight',
      editable: true,
      width: '10%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      editable: true,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="link" onClick={() => save(record.key)} icon={<SaveOutlined />}>保存</Button>
            <Button type="link" onClick={cancel} danger>取消</Button>
          </Space>
        ) : (
          <Space>
            <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)} icon={<EditOutlined />}>编辑</Button>
            <Popconfirm title="确定删除此评价维度吗?" onConfirm={() => handleDelete(record.key)}>
              <Button type="link" danger disabled={editingKey !== ''} icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 模板列表列定义
  const templateColumns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '维度数量',
      dataIndex: 'dimensionCount',
      key: 'dimensionCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#faad14' }}>
          {status === 'active' ? '已启用' : '草稿'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Popconfirm title="确定删除此模板吗?" onConfirm={() => message.success('删除成功')}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 可编辑单元格组件
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }: any) => {
    let inputNode;
    
    switch (dataIndex) {
      case 'type':
        inputNode = (
          <Select>
            <Option value="text">文本</Option>
            <Option value="number">数值</Option>
            <Option value="select">选择</Option>
            <Option value="rating">评分</Option>
            <Option value="upload">上传</Option>
          </Select>
        );
        break;
      case 'required':
        inputNode = <Switch checked={record?.required} />;
        break;
      case 'weight':
        inputNode = <InputNumber min={0} max={100} />;
        break;
      default:
        inputNode = <Input />;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  // 合并列配置
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/evaluation"><ArrowLeftOutlined /> 中药评价与申报</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>评价表单自定义</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>评价表单自定义</Title>
      <Text type="secondary" className="block mb-6">设置药材外观、成分含量、来源渠道等评价维度</Text>

      <Tabs defaultActiveKey="1">
        <TabPane tab="表单设计" key="1">
          <Card className="mb-6">
            <Form layout="vertical">
              <Form.Item label="表单名称" required>
                <Input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  placeholder="请输入表单名称"
                  style={{ maxWidth: '500px' }}
                />
              </Form.Item>
              <Form.Item label="表单描述">
                <Input.TextArea 
                  value={formDescription} 
                  onChange={(e) => setFormDescription(e.target.value)} 
                  placeholder="请输入表单描述"
                  rows={3}
                  style={{ maxWidth: '500px' }}
                />
              </Form.Item>
            </Form>
          </Card>

          <Card 
            title="评价维度设置" 
            extra={
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加维度</Button>
                <Button icon={<EyeOutlined />} onClick={handlePreview}>预览</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveForm}>保存表单</Button>
              </Space>
            }
          >
            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                bordered
                dataSource={dimensions}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
                rowKey="key"
              />
            </Form>
            <div className="mt-4 text-right">
              <Text type="secondary">提示：权重总和应为100%</Text>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="模板管理" key="2">
          <Card
            title="评价表单模板"
            extra={
              <Button type="primary" icon={<PlusOutlined />}>创建新模板</Button>
            }
          >
            <Table
              dataSource={templates}
              columns={templateColumns}
              rowKey="id"
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}