export type Material = {
    count: number,
    des: string,
    herbId: number,
    herbName: string,
    id: number,
    isvalid: boolean,
    time: string,
    title: string,
    type: string,
    userId: number,
    username: string
}

export type MaterialContent = {
    id: string,
    type: string,
    order: number,
    des: string,
    url: string | null
}

export type MaterialFull = {
    id: number,
    title: string,
    type: string,
    des: string,
    herbId: number,
    herbName: string,
    userId: number,
    userName: string,
    time: string,
    count: number,
    contents: MaterialContent []
}