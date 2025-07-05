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