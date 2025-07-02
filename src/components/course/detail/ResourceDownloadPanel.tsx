import { Card, List, Button, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function ResourceDownloadPanel({ resources, onDownload }: { resources: any[]; onDownload: (resource: any) => void }) {
  if (!resources || resources.length === 0) return null;
  return (
    // <Card className="mb-6" title={<span><DownloadOutlined className="mr-2" />资源下载</span>}>
    //   <List
    //     dataSource={resources}
    //     renderItem={resource => (
    //       <List.Item>
    //         <div className="flex justify-between items-center w-full">
    //           <div>
    //             <Text strong>{resource.name}</Text>
    //             <Text type="secondary" className="ml-2">{resource.type} / {resource.size}</Text>
    //           </div>
    //           <Button icon={<DownloadOutlined />} onClick={() => onDownload(resource)}>
    //             下载
    //           </Button>
    //         </div>
    //       </List.Item>
    //     )}
    //   />
    // </Card>
              <Card 
            title={<span><DownloadOutlined className="mr-2" />资源下载</span>}
            className="mb-6"
          >
            <List
              dataSource={course.resources || []}
              renderItem={resource => (
                <List.Item
                  actions={[
                    <Button 
                      key="download" 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(resource)}
                    >
                      下载
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          resource.type === 'video' ? <PlayCircleOutlined /> : 
                          resource.type === 'pdf' ? <FileTextOutlined /> : 
                          resource.type === 'excel' ? <FileTextOutlined /> : 
                          <DownloadOutlined />
                        } 
                        style={{
                          backgroundColor: 
                            resource.type === 'video' ? '#1890ff' : 
                            resource.type === 'pdf' ? '#f5222d' : 
                            resource.type === 'excel' ? '#52c41a' : 
                            '#faad14'
                        }}
                      />
                    }
                    title={resource.name}
                    description={`${resource.type.toUpperCase()} · ${resource.size}`}
                  />
                </List.Item>
              )}
            />
          </Card>
          
  );
}