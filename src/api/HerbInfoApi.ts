import axiosInstance from "@/api/config";

export const HERB_API = {
    GET_HERB_DETAIL: (name: string) => `/herb-info-service/herbs/info/${name}`,
    GET_ALL_HERBS: '/herb-info-service/herbs',
    GET_CATEGORIES: '/herb-info-service/category',
    GET_HERB_COURSES: (herbId: number) => `/herb-teaching-service/courses/herbs/${herbId}`,
    GET_HERB_LOCATIONS_BY_NAME: (name: string) => `/herb-info-service/herbs/location/herbname/${name}`,
    GET_HERBS_BY_LOCATION: (location: string) => `/herb-info-service/herbs/location/district/${location}`,
};

export const getHerbLocationsByName = (name:string) => {
    return axiosInstance.get(HERB_API.GET_HERB_LOCATIONS_BY_NAME(name));
}

export const getHerbsByLocation = (location:string) => {
    return axiosInstance.get(HERB_API.GET_HERBS_BY_LOCATION(location));
}

export const getAllHerbs = () => {
    return axiosInstance.get(HERB_API.GET_ALL_HERBS);
}

// 实验相关API
export const LAB_API = {
    // 获取课程实验列表
    GET_COURSE_LABS: (courseId: number) => `/herb-teaching-service/courses/${courseId}/labs`,
    // 创建实验
    CREATE_LAB: (courseId: number) => `/herb-teaching-service/courses/${courseId}/labs`,
    // 获取单个实验详情
    GET_LAB_DETAIL: (labId: number) => `/herb-teaching-service/labs/${labId}`,
    // 更新实验
    UPDATE_LAB: (labId: number) => `/herb-teaching-service/labs/${labId}`,
    // 删除实验
    DELETE_LAB: (labId: number) => `/herb-teaching-service/labs/${labId}`,
    // 获取所有实验（管理员用）
    GET_ALL_LABS: () => `/herb-teaching-service/labs`,
};