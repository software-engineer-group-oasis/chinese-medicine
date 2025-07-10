import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * 导出数据为 Excel 文件
 * @param {Array} data - 要导出的数据数组
 * @param {Array} columns - 表格列配置（antd 格式）
 * @param {string} [filename='导出数据.xlsx'] - 导出的文件名
 */

//  @ts-ignore
export const exportToExcel = (data, columns, filename = '导出数据.xlsx') => {
    if (!data || data.length === 0) {
        console.warn('没有可导出的数据');
        return;
    }

    // 构造映射关系：{ key: dataIndex }
    const headerMap = {};
    // @ts-ignore
    const headers = [];
// @ts-ignore
    columns.forEach(col => {
        if (col.dataIndex) {
            const key = typeof col.dataIndex === 'string' ? col.dataIndex : col.dataIndex.join('.');
            // @ts-ignore
            headerMap[key] = col.title;
            headers.push(key);
        }
    });

    // 提取指定字段并重命名表头
    //@ts-ignore
    const formattedData = data.map(item => {
        const row = {};
        //@ts-ignore
        headers.forEach(key => {
        //@ts-ignore
            const value = key.split('.').reduce((acc, part) => acc && acc[part], item);
            // @ts-ignore
            row[headerMap[key]] = value;
        });
        return row;
    });

    // 生成工作表
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 创建工作簿并写入数据
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // 写出二进制数据
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 下载文件
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
};