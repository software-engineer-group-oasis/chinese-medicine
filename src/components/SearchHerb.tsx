import { useState, useEffect } from 'react';
import { Input, List, Card } from 'antd';
import {ArrowRightOutlined, CaretRightOutlined, NumberOutlined, SearchOutlined} from '@ant-design/icons';
import {Location} from "@/constTypes/herbs"
import axiosInstance from "@/api/config";
import Link from "next/link";
const { Meta } = Card;


export default function SearchHerb() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = (term: string) => {
      axiosInstance.get(`/herb-info-service/herbs/location/herbname/${term}`)
          .then(res => {
              console.log("search response", res);
              if (res.data.code === 0) {
                  console.log("search results", res.data);
                  console.log(res.data.locations);
                  setSearchResults(res.data.locations);
              } else {
                  throw new Error("搜索失败")
              }
          })
          .catch(error => {
              setSearchResults([]);
              console.error("搜索失败", error.message);
          })
          .finally(() => {
              setLoading(false);
          })
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      fetchData((searchTerm))
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={'w-[60%] mx-auto py-4'}>
      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined />}
        placeholder="请输入药材名称"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 8 }}
      />

      {searchResults.length > 0 && (
        <Card loading={loading} size="small" style={{ maxHeight: 200, overflowY: 'auto' }} id={'card'}>
          <List
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={<Link href={`/main/trace?herbName=${item.herbName}`}>{item.herbName}<span className={'ml-2'}> <ArrowRightOutlined /> {item.districtName + "--" + item.streetName } <span className={'text-green-500 font-bold'}><NumberOutlined />{item.count + "株"}</span>  </span></Link>}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
        <style>{`
        #card {
            background-image: linear-gradient(180deg, oklch(89.7% 0.196 126.665), oklch(90.5% 0.182 98.111));
        }
        `}</style>
    </div>
  );
}