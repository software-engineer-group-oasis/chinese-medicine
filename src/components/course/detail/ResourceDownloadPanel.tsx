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
            //@ts-ignore
              dataSource={course.resources || []}
              renderItem={resource => (
                <List.Item
                  actions={[
                    <Button 
                      key="download" 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      //@ts-ignore
                      onClick={() => handleDownload(resource)}
                    >
                      下载
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                    //@ts-ignore
                      <Avatar 
                        icon={
                        //@ts-ignore
                          resource.type === 'video' ? <PlayCircleOutlined /> : 
                          //@ts-ignore
                          resource.type === 'pdf' ? <FileTextOutlined /> : 
                          //@ts-ignore
                          resource.type === 'excel' ? <FileTextOutlined /> : 
                          <DownloadOutlined />
                        } 
                        style={{
                          backgroundColor: 
                          //@ts-ignore
                            resource.type === 'video' ? '#1890ff' :
                            //@ts-ignore 
                            resource.type === 'pdf' ? '#f5222d' : 
                            //@ts-ignore
                            resource.type === 'excel' ? '#52c41a' : 
                            '#faad14'
                        }}
                      />
                    }
                    //@ts-ignore
                    title={resource.name}
                    //@ts-ignore
                    description={`${resource.type.toUpperCase()} · ${resource.size}`}
                  />
                </List.Item>
              )}
            />
          </Card>
          
  );
}