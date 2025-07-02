"use client"
import React, {Suspense, useEffect, useState} from 'react';
import axiosInstance from "@/api/config";
import {StatsByHerb} from "@/constTypes/herbs";

interface DataRow {
  id: number;
  name: string;
  value: number;
}

interface DataTableProps {
  title?: string;
}

const IndexDataTable: React.FC<DataTableProps> = ({ title = "中药材数据"}: DataTableProps) => {
    const [dataRows, setDataRows] = useState<DataRow[]>([]);
    useEffect(() => {
        axiosInstance.get("/herb-info-service/herbs/location/count/topHerbs").then(res => {
            if (res.data.code === 0) {
                console.log("统计信息",res.data);
                const data:DataRow[] = res.data.result.map((item:StatsByHerb, index:number) => (
                    {
                        id: index + 1,
                        name: item.herbName,
                        value: item.herbNumber
                    }
                ))
                setDataRows(data);
            } else {
                console.error(res.data.message);
            }
        }).catch(err => {
            console.error(err.message);
        })
    }, []);
  return (
      <Suspense fallback={<div>加载中...</div>}>
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
                  
                  table {
                      width: 100%;
                  }
                  
                  th {
                      background-color: rgba(255, 255, 255, 0.2);
                  }
                  
                  th, td {
                      padding: 0 2rem;
                      text-align: left;
                  }
                  
                  tbody tr:nth-child(even) {
                      background-color: rgba(255, 255, 255, 0.1);
                  }
              `}
              </style>
          </div>
      </Suspense>

  );
};

export default IndexDataTable;
