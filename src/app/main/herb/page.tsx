"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import { Typography, Spin, message } from "antd";
import axiosInstance from "@/api/config";
import { HERB_API } from "@/api/HerbInfoApi";
import HerbHome from "@/components/HerbHome";
import HerbDetail from "@/components/HerbDetail";

const { Text } = Typography;

const propertyTags = [
  "寒", "热", "温", "凉", "平", "辛", "甘", "苦", "酸", "咸",
];
const partTags = [
  "根", "茎", "叶", "花", "果实", "皮", "全草", "种子", "树脂", "菌类",
];

const PAGE_SIZE = 15;

export default function HerbPage() {
  const searchParam = useSearchParams();
  const herbId = searchParam.get("id");
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("全部");
  const [partFilter, setPartFilter] = useState("全部");
  const [page, setPage] = useState(1);

  // 药材数据
  const [allHerbs, setAllHerbs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(HERB_API.GET_ALL_HERBS)
      .then((res) => {
        if (res.data.code === 0) {
          setAllHerbs(res.data.herbs || []);
        } else {
          message.error("获取药材列表失败");
        }
      })
      .catch(() => {
        message.error("获取药材列表失败");
      })
      .finally(() => setLoading(false));
  }, []);

  // 查询功能：按名称模糊搜索+分类筛选
  const filteredHerbs = useMemo(() => {
    let herbs = allHerbs;
    if (searchText.trim()) {
      herbs = herbs.filter((h) => h.name.includes(searchText.trim()));
    }
    if (propertyFilter !== "全部") {
      herbs = herbs.filter((h) => h.property === propertyFilter);
    }
    if (partFilter !== "全部") {
      herbs = herbs.filter((h) => h.part === partFilter);
    }
    return herbs;
  }, [allHerbs, searchText, propertyFilter, partFilter]);

  // 分页
  const total = filteredHerbs.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const herbsToShow = filteredHerbs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;

  if (!herbId) {
    return (
      <HerbHome
        searchText={searchText}
        setSearchText={setSearchText}
        propertyFilter={propertyFilter}
        setPropertyFilter={setPropertyFilter}
        partFilter={partFilter}
        setPartFilter={setPartFilter}
        page={page}
        setPage={setPage}
        herbsToShow={herbsToShow}
        total={total}
        pageCount={pageCount}
        propertyTags={propertyTags}
        partTags={partTags}
        PAGE_SIZE={PAGE_SIZE}
      />
    );
  } else {
    return <HerbDetail herbId={herbId} allHerbs={allHerbs} />;
  }
}