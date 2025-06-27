"use client"
import {useSearchParams} from "next/navigation";
import GrowthTimeline from '@/components/GrowthTimeline';
import CommentSection from '@/components/CommentSection';
import React, { useCallback, useState, useMemo } from "react";
import { Row, Col, Input, Button, Tag, Breadcrumb, Typography, Pagination, Select } from "antd";
import { SearchOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { herbDetails, HerbDetail as HerbDetailType } from '@/mock/herbData';
import HerbHome from '@/components/HerbHome';
import HerbDetail from '@/components/HerbDetail';

const { Text } = Typography;

const allHerbs: { name: string; img: string; property?: string; part?: string }[] = herbDetails.map(h => ({
  name: h.name,
  img: h.img,
  property: h.property,
  part: h.part,
}));
//中草药特性，方便筛选
const propertyTags = [
  '寒', '热', '温', '凉', '平', '辛', '甘', '苦', '酸', '咸',
];
const partTags = [
  '根', '茎', '叶', '花', '果实', '皮', '全草', '种子', '树脂', '菌类',
];

const PAGE_SIZE = 15;

export default function HerbPage() {
    const searchParam = useSearchParams();
    const herbId = searchParam.get('id');
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('全部');
    const [partFilter, setPartFilter] = useState('全部');
    const [page, setPage] = useState(1);

    // 查询功能：按名称模糊搜索+分类筛选
    const filteredHerbs = useMemo(() => {
        let herbs = allHerbs;
        if (searchText.trim()) {
            herbs = herbs.filter(h => h.name.includes(searchText.trim()));
        }
        if (propertyFilter !== '全部') {
            herbs = herbs.filter(h => h.property === propertyFilter);
        }
        if (partFilter !== '全部') {
            herbs = herbs.filter(h => h.part === partFilter);
        }
        return herbs;
    }, [searchText, propertyFilter, partFilter]);

    // 分页
    const total = filteredHerbs.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const herbsToShow: { name: string; img: string }[] = filteredHerbs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        return <HerbDetail herbId={herbId} />;
    }
}