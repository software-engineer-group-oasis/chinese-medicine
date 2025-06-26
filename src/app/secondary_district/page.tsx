// 展示区县数据，使用表格分条目展示
// 使用饼状图进行数据聚合统计
'use client'
import { useSearchParams } from 'next/navigation'
import {geoJson} from '@/assets/secondaryGeo'
import axios from 'axios'
import * as echarts from 'echarts'
import ReactEcharts from "echarts-for-react"
import React, {useEffect, useState} from "react"
import {mockTableData, columns} from "@/mock/data";
import { Table } from "antd";

export default function SecondaryDistrictPage() {
  const searchParams = useSearchParams()
  const [option, setOption] = useState<echarts.EChartOption>();

  // 获取单个查询参数
  const name = searchParams.get('name')
  const value = searchParams.get('value')

  useEffect(() => {
        axios.get(geoJson[name]).then(res => {
          console.log(res.data)
          echarts.registerMap(name, res.data)
          setOption({
            animation: true,
            animationDuration: 2000,
            animationEasing: 'cubicOut',
            tooltip: {
              backgroundColor: 'rgba(50, 50, 50, 0.7)',
              borderColor: '#333',
              textStyle: {
                color: '#fff'
              },
              trigger: 'item',
              formatter: (params) => {
                return `${params.name}<br/>数值：${params.value || 0}`;
              }
            },
            series: [{
              type: 'map',
              map: name, // 这里必须已经通过 registerMap 注册过
              roam: true,
              label: {
                show:true,//显示标签
                // formatter: (params) => {
                //   return params?.value || 0
                // },
              },
              emphasis: {
                areaColor: '#2a333d',
                borderColor: '#111'
              },
              data: [
                {
                  name: name,
                  value: value
                }
              ]
            }]
          })
        })
    }
  ,[name, value])


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">区县数据查询</h1>
      { option &&
          <ReactEcharts
              option={option}
              style={{ width: '100%', height: '100%' }}
          />
      }
      <Table dataSource={mockTableData} columns={columns}  pagination={{
        pageSize: 5,     // 每页显示条数
        total: mockTableData.length,// 总数据条数
      }} />
    </div>
  )
}