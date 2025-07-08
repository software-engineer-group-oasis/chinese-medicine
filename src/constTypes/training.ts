export type liveRoom = {
    id: number,
    title: string,
    coverUrl: string,
    userId: number,
    streamKey: string,
    streamUrl: string,
    hlsUrl: string,
    flvUrl: string,
    status: number,
    viewCount: number,
    likeCount: number | null,
    startTime: string | null,
    endTime: string | null,
    createdAt: string,
    updatedAt: string
}