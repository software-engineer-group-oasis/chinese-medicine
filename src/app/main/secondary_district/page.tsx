// 展示区县数据，使用表格分条目展示
// 使用饼状图进行数据聚合统计
'use client'
import {useSearchParams} from 'next/navigation'
import {geoJson} from '@/assets/secondaryGeo'
import axios from 'axios'
import * as echarts from 'echarts'
import ReactEcharts from "echarts-for-react"
import React, {useEffect, useState} from "react"
import {Table, type TableProps} from "antd";
import {getHerbsByLocation} from '@/api/HerbInfoApi';
import {Location} from "@/const/types"
import Link from "next/link";

const columns:TableProps<Location>['columns'] = [
  {
    title: '药材名称',
    dataIndex: 'herbName',
    key: 'herbName'
  },
  {
    title: '药材编号',
    dataIndex: 'herbId',
    key: 'herbId',
    render: (text, record) => <Link href={`/secondary_district/detail?herbId=${text}&herbName=${record.herbName}`}>{text}</Link>
  },
  {
    title: '数量',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '药材产地',
    dataIndex: 'streetName',
    key: 'streetName'
  },
  {
    title: '经度',
    dataIndex: 'longitude',
    key: 'longitude'
  },
  {
    title: '纬度',
    dataIndex: 'latitude',
    key: 'latitude'
  }
]

export default function SecondaryDistrictPage() {
  const searchParams = useSearchParams()
  const [option, setOption] = useState<echarts.EChartOption>();

  // 获取单个查询参数
  const name = searchParams.get('name')
  const value = searchParams.get('value')

  useEffect(() => {
        const geoJsonTyped = geoJson as Record<string, string>;
        axios.get(geoJsonTyped[name]).then(res => {
          console.log(res.data)
          echarts.registerMap(name as string, res.data)
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

  const [locations, setLocations] = useState<Location []>([]);
  useEffect(()=> {
    if (name) {
      getHerbsByLocation(name).then(res => setLocations(res.data.locations))
    }
  }, [])


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">区县数据查询</h1>
      { option &&
          <ReactEcharts
              option={option}
              style={{ width: '100%', height: '100%' }}
          />
      }
      <Table dataSource={locations} columns={columns}  pagination={{
        pageSize: 5,     // 每页显示条数
        total: locations.length,// 总数据条数
      }}
      rowKey={'herbId'}/>
    </div>
  )
}