// 实现表格数据的滚动刷新
import React from 'react';

interface DataRow {
  id: number;
  name: string;
  value: number;
}

interface ScrollingDataTableProps {
  title?: string;
  initialData: DataRow[];
}

const IndexDataTable: React.FC<ScrollingDataTableProps> = ({ title = "中药材数据", initialData }) => {
  const dataRows = initialData;

  return (
          <div id={'box-1'}>
              <div id={'box-1-main'}>
                  <h2 className="text-xl font-bold mb-2">{title}</h2>
                  <div>
                      <table>
                          <thead>
                          <tr>
                              <th>序号</th>
                              <th>名称</th>
                              <th>数量</th>
                          </tr>
                          </thead>
                          <tbody>
                          {dataRows.map((row) => (
                              <tr key={row.id}>
                                  <td>{row.id}</td>
                                  <td>{row.name}</td>
                                  <td>{row.value}</td>
                              </tr>
                          ))}
                          </tbody>
                      </table>
                  </div>
          </div>
      {/* 自定义动画样式 */}
      <style jsx global>{`
        #box-1 {
            background-image: url('/images/box1_bg.png');
            background-size: contain; // 整张图片显示
            background-repeat: no-repeat;
            background-position: center;
            width: 100%;
            height: auto;
            aspect-ratio: 567/343;
            position: relative;
        }

        #box-1-main {
            color: #fff;
            position: absolute;
            left: 10%;
            top: 12%;
        }
      `}
      </style>
    </div>
  );
};

export default IndexDataTable;
