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