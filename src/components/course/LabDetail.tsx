import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Modal, message } from 'antd';
import { ExperimentOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { LAB_API } from '@/api/HerbInfoApi';

interface Lab {
  labId: number;
  courseId: number;
  labName: string;
  labSteps: string;
  labOrder: number;
}

interface LabDetailProps {
  courseId: number;
  showActions?: boolean;
}

export default function LabDetail({ courseId, showActions = false }: LabDetailProps) {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 获取课程实验列表
  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(LAB_API.GET_COURSE_LABS(courseId));
      if (response.data.code === 0) {
        setLabs(response.data.data || []);
      } else {
        message.error('获取实验列表失败');
      }
    } catch (error) {
      console.error('获取实验列表错误:', error);
      message.error('获取实验列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLabs();
    }
  }, [courseId]);

  // 查看实验详情
  const showLabDetail = (lab: Lab) => {
    setSelectedLab(lab);
    setIsModalVisible(true);
  };

  if (loading) {
    return <Card loading={true} />;
  }

  if (labs.length === 0) {
    return (
      <Card title="课程实验" className="mb-4">
        <div className="text-center text-gray-500 py-8">
          <ExperimentOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>暂无实验内容</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card title="课程实验" className="mb-4">
        <List
          dataSource={labs.sort((a, b) => a.labOrder - b.labOrder)}
          renderItem={(lab) => (
            <List.Item
              actions={
                showActions ? [
                  <Button
                    key="view"
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => showLabDetail(lab)}
                  >
                    查看详情
                  </Button>
                ] : []
              }
            >
              <List.Item.Meta
                avatar={<ExperimentOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />}
                title={
                  <div className="flex items-center gap-2">
                    <span>{lab.labName}</span>
                    <Tag color="orange">实验 {lab.labOrder}</Tag>
                  </div>
                }
                description={
                  <div className="text-gray-600">
                    {lab.labSteps.length > 100 
                      ? `${lab.labSteps.substring(0, 100)}...` 
                      : lab.labSteps
                    }
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 实验详情模态框 */}
      <Modal
        title="实验详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedLab && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">实验名称：</label>
                  <span>{selectedLab.labName}</span>
                </div>
                <div>
                  <label className="font-medium">排序序号：</label>
                  <span>{selectedLab.labOrder}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">实验步骤</h3>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="whitespace-pre-wrap">{selectedLab.labSteps}</pre>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
} 