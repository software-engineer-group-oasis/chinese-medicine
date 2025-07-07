export type Location = {
    id: number,
    herbId: number,
    herbName: string,
    count: number,
    districtId: number,
    districtName: string,
    streetId: number,
    streetName: string,
    longitude: number,
    latitude: number
}

export type District = {
    id: number,
    name: string
}

export type Street = {
    streetId: number,
    districtId: number,
    streetName: string,
    districtName: string,
}

export const locationColumns = [
    {title: "编号", dataIndex: "herbId", key: "herbId"},
    {title: "药材名称", dataIndex: "herbName", key: "herbName"},
    {title: "数量", dataIndex: "count", key: "count"},
    {title: "行政区", dataIndex: "districtName", key: "districtName"},
    {title: "街道", dataIndex: "streetName", key: "streetName"},
    {title: "经纬度", dataIndex: "coordinates", key: "coordinates",
        render: (_: any, record:Location) => (
            <span>
                [{record.longitude},{record.latitude}]
            </span>
        )
    },

]

export const growthColumns = [
    {title: "记录编号", dataIndex: "id", key: "id"},
    {title: "批次号", dataIndex: "batchCode", key: "batchCode"},
    {title: "药材编号", dataIndex: "herbId", key: "herbId"},
    {title: "药材名", dataIndex: "herbName", key: "herbName"},
    {title: "描述", dataIndex: "des", key: "des"},
    {title: "温度", dataIndex: "temperature", key: "temperature"},
    {title: "湿度", dataIndex: "wet", key: "wet"},
    {title: "记录者编号", dataIndex: "userId", key: "userId"},
    {title: "操作", dataIndex: "action", key: "action"},
]

export type HerbCategory = {
    id: number,
    name: string,
}

export type HerbLinkCategory = {
    id: number,
    herbId: number,
    herbName: string,
    categoryId: number,
    categoryName: string
}

export type Herb = {
    id: number,
    name: string,
    origin: string,
    image: string,
    des: string
    herbLinkCategoryList: HerbLinkCategory[]
}

export type StatsByHerb = {
    herbName: string,
    herbNumber: number
}

export type StatsByDistrict = {
    districtName: string,
    herbCount: number
}

export type HerbGrowth = {
    id: number,
    herbId: number,
    herbName: string,
    batchCode: string,
    wet: number,
    temperature: number,
    des: string,
    longitude: number,
    latitude: number,
    userId: number,
    recordTime: string,
    imgUrl: string
}