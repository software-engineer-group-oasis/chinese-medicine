import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Space, Tooltip, Tag, Popconfirm, Empty
} from 'antd';
import { 
  DeleteOutlined, PlusOutlined, SearchOutlined,
  LinkOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { userPermission } from '@/hooks/usePermission';

const { Option } = Select;

interface Herb {
  herbId: number;
  herbName: string;
  herbAlias?: string;
  herbImageUrl?: string;
  herbDescription?: string;
}

interface CourseHerb {
  courseHerbId: number;
  courseId: number;
  herbId: number;
  herbName: string;
  herbAlias?: string;
  herbImageUrl?: string;
  linkTime: string;
}

interface CourseHerbManagerProps {
  courseId: number;
}

export default function CourseHerbManager({ courseId }: CourseHerbManagerProps) {
  const [courseHerbs, setCourseHerbs] = useState<CourseHerb[]>([]);
  const [availableHerbs, setAvailableHerbs] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedHerbIds, setSelectedHerbIds] = useState<number[]>([]);
  const [form] = Form.useForm();
  
  const permission = userPermission();
  const canLinkHerb = permission?.hasPermission('course:update');

  // 获取课程关联的药材列表
  const fetchCourseHerbs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/herb-teaching-service/courses/${courseId}/herbs`);
      if (response.data.code === 0) {
        setCourseHerbs(response.data.data || []);
      } else {
        message.error('获取课程关联药材失败');
      }
    } catch (error) {
      console.error('获取课程关联药材错误:', error);
      message.error('获取课程关联药材失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取可用药材列表
  const fetchAvailableHerbs = async () => {
    try {
      const response = await axiosInstance.get('/herb-service/herbs', {
        params: { keyword: searchValue, pageSize: 50, pageNum: 1 }
      });
      if (response.data.code === 0) {
        // 过滤掉已经关联的药材
        const linkedHerbIds = courseHerbs.map(herb => herb.herbId);
        const filteredHerbs = response.data.data.list.filter(
          (herb: Herb) => !linkedHerbIds.includes(herb.herbId)
        );
        setAvailableHerbs(filteredHerbs);
      } else {
        message.error('获取可用药材失败');
      }
    } catch (error) {
      console.error('获取可用药材错误:', error);
      message.error('获取可用药材失败，请稍后重试');
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseHerbs();
    }
  }, [courseId]);

  // 打开关联药材模态框
  const showModal = () => {
    setIsModalVisible(true);
    setSelectedHerbIds([]);
    setSearchValue('');
    fetchAvailableHerbs();
  };

  // 处理搜索药材
  const handleSearch = () => {
    fetchAvailableHerbs();
  };

  // 处理选择药材
  const handleSelectHerb = (herbId: number, selected: boolean) => {
    if (selected) {
      setSelectedHerbIds([...selectedHerbIds, herbId]);
    } else {
      setSelectedHerbIds(selectedHerbIds.filter(id => id !== herbId));
    }
  };

  // 处理关联药材
  const handleLinkHerbs = async () => {
    if (selectedHerbIds.length === 0) {
      message.warning('请选择要关联的药材');
      return;
    }

    try {
      const response = await axiosInstance.post(`/herb-teaching-service/${courseId}/herbs/link`, {
        herbIds: selectedHerbIds
      });
      if (response.data.code === 0) {
        message.success('药材关联成功');
        fetchCourseHerbs(); // 刷新关联药材列表
        setIsModalVisible(false);
      } else {
        message.error('药材关联失败');
      }
    } catch (error) {
      console.error('关联药材错误:', error);
      message.error('药材关联失败，请稍后重试');
    }
  };

  // 处理取消关联药材
  const handleUnlinkHerb = async (courseHerbId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/herb-teaching-service/${courseId}/herbs/${courseHerbId}`
      );
      if (response.data.code === 0) {
        message.success('取消关联成功');
        fetchCourseHerbs(); // 刷新关联药材列表
      } else {
        message.error('取消关联失败');
      }
    } catch (error) {
      console.error('取消关联药材错误:', error);
      message.error('取消关联失败，请稍后重试');
    }
  };

  // 关联药材列表列定义
  const columns = [
    {
      title: '药材名称',
      dataIndex: 'herbName',
      key: 'herbName',
    },
    {
      title: '别名',
      dataIndex: 'herbAlias',
      key: 'herbAlias',
      render: (text: string) => text || '-',
    },
    {
      title: '关联时间',
      dataIndex: 'linkTime',
      key: 'linkTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CourseHerb) => (
        <Space size="middle">
          <Tooltip title="查看药材详情">
            <Button 
              type="link" 
              icon={<SearchOutlined />} 
              onClick={() => window.open(`/main/herb/${record.herbId}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="取消关联">
            <Popconfirm
              title="确定要取消关联这个药材吗?"
              onConfirm={() => handleUnlinkHerb(record.courseHerbId)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">课程关联药材管理</h3>
        {canLinkHerb && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            关联药材
          </Button>
        )}
      </div>

      {courseHerbs.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={courseHerbs.map(herb => ({ ...herb, key: herb.courseHerbId }))} 
          loading={loading}
          pagination={false}
        />
      ) : (
        <Empty description="暂无关联药材" />
      )}

      {/* 关联药材模态框 */}
      <Modal
        title="关联药材"
        open={isModalVisible}
        onOk={handleLinkHerbs}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <div className="mb-4 flex">
          <Input 
            placeholder="输入药材名称搜索" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: '300px' }}
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={handleSearch}
            className="ml-2"
          >
            搜索
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {availableHerbs.length > 0 ? (
            <Table 
              rowSelection={{
                type: 'checkbox',
                onSelect: (record, selected) => handleSelectHerb(record.herbId, selected),
                onSelectAll: (selected, selectedRows) => {
                  if (selected) {
                    setSelectedHerbIds(selectedRows.map(row => row.herbId));
                  } else {
                    setSelectedHerbIds([]);
                  }
                },
              }}
              columns={[
                {
                  title: '药材名称',
                  dataIndex: 'herbName',
                  key: 'herbName',
                },
                {
                  title: '别名',
                  dataIndex: 'herbAlias',
                  key: 'herbAlias',
                  render: (text: string) => text || '-',
                },
                {
                  title: '描述',
                  dataIndex: 'herbDescription',
                  key: 'herbDescription',
                  ellipsis: true,
                  render: (text: string) => text || '-',
                },
              ]} 
              dataSource={availableHerbs.map(herb => ({ ...herb, key: herb.herbId }))} 
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="暂无可关联药材" />
          )}
        </div>

        <div className="mt-4">
          <Space>
            <Tag icon={<CheckCircleOutlined />} color="success">
              已选择 {selectedHerbIds.length} 个药材
            </Tag>
            <Button 
              type="primary" 
              icon={<LinkOutlined />} 
              onClick={handleLinkHerbs}
              disabled={selectedHerbIds.length === 0}
            >
              确认关联
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}