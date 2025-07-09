// app/test-upload/page.tsx
"use client"
export default function TestUploadPage() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const resultElement = document.getElementById('result');
    const errorElement = document.getElementById('error');
    
    // 清空之前的结果
    if (resultElement) resultElement.textContent = '';
    if (errorElement) errorElement.textContent = '';
    
    try {
      const response = await fetch('/api/parse-table', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 显示成功结果
        if (resultElement) {
          resultElement.textContent = JSON.stringify(data, null, 2);
        }
      } else {
        // 显示错误信息
        if (errorElement) {
          errorElement.textContent = data.error || '处理文件时出错';
        }
      }
    } catch (err) {
      if (errorElement) {
        errorElement.textContent = '网络错误或服务器无响应';
      }
      console.error('上传失败:', err);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>学校学生表格上传测试</h1>
      <p>请上传包含<b>仅包含"学校"和"学生姓名"</b>两列的Excel文件</p>
      
      <form 
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}
      >
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="file" style={{ display: 'block', marginBottom: '5px' }}>
            选择Excel文件:
          </label>
          <input 
            type="file" 
            id="file" 
            name="file" 
            accept=".xlsx,.xls,.csv"
            required
          />
        </div>
        
        <button 
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          上传并解析
        </button>
      </form>
      
      <div style={{ marginTop: '30px' }}>
        <h2>解析结果:</h2>
        <pre 
          id="result"
          style={{
            padding: '15px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '5px',
            minHeight: '100px',
            whiteSpace: 'pre-wrap',
          }}
        ></pre>
        
        <h2 style={{ color: 'red', marginTop: '20px' }}>错误信息:</h2>
        <div 
          id="error"
          style={{
            padding: '15px',
            backgroundColor: '#fff0f0',
            border: '1px solid #ffcccc',
            borderRadius: '5px',
            color: 'red',
            minHeight: '50px',
          }}
        ></div>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
        <h3>测试文件要求:</h3>
        <ul>
          <li>必须包含且仅包含两列："学校"和"学生姓名"</li>
          <li>支持的格式: .xlsx, .xls, .csv</li>
          <li>第一行必须是列标题</li>
        </ul>
        
        <h3 style={{ marginTop: '15px' }}>示例格式:</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ border: '1px solid #999', padding: '8px' }}>学校</th>
              <th style={{ border: '1px solid #999', padding: '8px' }}>学生姓名</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #999', padding: '8px' }}>第一中学</td>
              <td style={{ border: '1px solid #999', padding: '8px' }}>张三</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #999', padding: '8px' }}>第二中学</td>
              <td style={{ border: '1px solid #999', padding: '8px' }}>李四</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}