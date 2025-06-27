"use client";
import { useState } from "react";
import { Upload, Button, message, Modal, List, Typography, Input, Select } from "antd";
import { UploadOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, FileTextOutlined } from "@ant-design/icons";
import React from "react";

const { Text } = Typography;
const { Option } = Select;

interface UploadedFile {
    uid: string;
    name: string;
    size: number;
    type: string;
    lastModified: number;
    preview?: string;
}

const ResearchDataUpload: React.FC = () => {
    const [fileList, setFileList] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
    const [researchName, setResearchName] = useState("");
    const [researchType, setResearchType] = useState<string | undefined>(undefined);

    // 处理文件选择
    const handleBeforeUpload = (file: File) => {
        // 添加到文件列表
        const uploadedFile: UploadedFile = {
            uid: file.lastModified.toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
        };

        setFileList(prevList => [...prevList, uploadedFile]);
        return false; // 阻止自动上传
    };

    // 处理文件移除
    const handleRemove = (file: UploadedFile) => {
        setFileList(prevList => prevList.filter(f => f.uid !== file.uid));
    };

    // 处理文件预览
    const handlePreview = async (file: UploadedFile) => {
        if (!file.preview && file.type.startsWith('image/')) {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file as any);

                reader.onload = () => {
                    setPreviewFile({
                        ...file,
                        preview: reader.result as string
                    });
                };
            } catch (error) {
                message.error("无法预览文件");
            }
        } else {
            setPreviewFile(file);
        }

        setPreviewVisible(true);
    };

    // 处理上传
    const handleUpload = () => {
        if (fileList.length === 0) {
            message.warning("请先选择要上传的文件");
            return;
        }

        if (!researchName.trim()) {
            message.warning("请输入科研数据名称");
            return;
        }

        if (!researchType) {
            message.warning("请选择科研数据类型");
            return;
        }

        setIsUploading(true);

        // 模拟上传过程
        setTimeout(() => {
            setIsUploading(false);
            message.success(`${fileList.length} 个文件上传成功`);
            setFileList([]);
            setResearchName("");
            setResearchType(undefined);
        }, 1500);
    };

    // 获取文件图标
    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FilePdfOutlined className="text-red-500 text-xl" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheetml')) return <FileExcelOutlined className="text-green-500 text-xl" />;
        if (fileType.includes('word') || fileType.includes('document')) return <FileWordOutlined className="text-blue-500 text-xl" />;
        return <FileTextOutlined className="text-gray-500 text-xl" />;
    };

    return (
        <div className="research-data-upload bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">科研数据上传</h2>
            <p className="text-gray-600 mb-6">请输入科研数据信息并选择要上传的文件。</p>

            {/* 表单输入区域 */}
            <div className="form-container bg-gray-50 rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">名称<span className="text-red-500">*</span></label>
                    <Input
                        value={researchName}
                        onChange={(e) => setResearchName(e.target.value)}
                        placeholder="请输入科研数据名称"
                        size="large"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">类型<span className="text-red-500">*</span></label>
                    <Select
                        value={researchType}
                        onChange={(value) => setResearchType(value)}
                        placeholder="请选择科研数据类型"
                        size="large"
                        className="w-full"
                    >
                        <Option value="论文">论文</Option>
                        <Option value="数据集">数据集</Option>
                        <Option value="专利">专利</Option>
                    </Select>
                </div>
            </div>

            {/* 文件上传区域 */}
            <div className="upload-container border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                <Upload
                    beforeUpload={handleBeforeUpload}
                    onRemove={handleRemove}
                    onPreview={handlePreview}
                    fileList={fileList}
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.json,.xml"
                >
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
            </div>

            {/* 文件列表 */}
            {fileList.length > 0 && (
                <div className="file-list bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-3">已选文件：</h3>
                    <List
                        itemLayout="horizontal"
                        dataSource={fileList}
                        renderItem={(file) => (
                            <List.Item
                                actions={[
                                    <Button type="link" onClick={() => handlePreview(file)}>预览</Button>,
                                    <Button type="link" danger onClick={() => handleRemove(file)}>移除</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={getFileIcon(file.type)}
                                    title={<span>{file.name}</span>}
                                    description={
                                        <div>
                                            <Text type="secondary">{(file.size / 1024).toFixed(2)} KB</Text>
                                            <br />
                                            <Text type="secondary">
                                                {new Date(file.lastModified).toLocaleDateString('zh-CN')}
                                            </Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end gap-4">
                <Button onClick={() => { setFileList([]); setResearchName(""); setResearchType(undefined); }} disabled={fileList.length === 0}>
                    清空列表
                </Button>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    loading={isUploading}
                    disabled={fileList.length === 0 || !researchName.trim() || !researchType}
                >
                    {isUploading ? "上传中..." : `上传 ${fileList.length} 个文件`}
                </Button>
            </div>

            {/* 预览模态框 */}
            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                title="文件预览"
            >
                {previewFile && previewFile.preview ? (
                    <img src={previewFile.preview} alt="预览" style={{ width: '100%' }} />
                ) : (
                    <div className="flex flex-col items-center py-8">
                        {getFileIcon(previewFile?.type || '')}
                        <p className="mt-2">暂不支持在线预览该类型文件</p>
                        <p>您可以下载或上传其他类型的文件进行预览</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ResearchDataUpload;
