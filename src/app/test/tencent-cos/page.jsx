"use client"
import React, { useState } from 'react';

const TencentCosTestPage = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('upload-file', file);

      const response = await fetch('/api/tencent-cos', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        // 手动添加 url 属性到文件对象
        const uploadedFile = {
          ...file,
          url: result.url,
          status: 'done',
        };
        setFileList(prevList => [...prevList, uploadedFile]);
        alert(`文件上传成功: ${result.url}`);
      } else {
        throw new Error(result.details || '上传失败');
      }
    } catch (error) {
      alert(`上传失败: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => handleUpload(file));
  };

  return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6">腾讯云COS文件上传测试</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <input
              type="file"
              onChange={handleChange}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
              disabled={uploading}
              className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />

          {uploading && (
              <div className="mt-4 text-blue-600">上传中，请稍候...</div>
          )}
        </div>

        {fileList.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">已上传文件:</h3>
              <ul className="space-y-2">
                {fileList.map((file, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span className="truncate">{file.name}</span>
                      {file.status === 'done' ? (
                          <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-4"
                          >
                            下载文件
                          </a>
                      ) : (
                          <span className="text-yellow-600">上传中...</span>
                      )}
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default TencentCosTestPage;
