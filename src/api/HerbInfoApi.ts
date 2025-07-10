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

// 课程管理相关API
export const COURSE_API = {
    // 获取课程列表（分页和筛选）
    GET_COURSES: (params?: any) => `/herb-teaching-service/courses${params ? '?' + new URLSearchParams(params).toString() : ''}`,
    // 获取单个课程详情
    GET_COURSE_DETAIL: (courseId: number) => `/herb-teaching-service/courses/${courseId}`,
    // 创建课程
    CREATE_COURSE: () => `/herb-teaching-service/courses`,
    // 更新课程信息
    UPDATE_COURSE: (courseId: number) => `/herb-teaching-service/courses/${courseId}`,
    // 删除课程
    DELETE_COURSE: (courseId: number) => `/herb-teaching-service/courses/${courseId}`,
    // 课程评分
    RATE_COURSE: (courseId: number) => `/herb-teaching-service/courses/${courseId}/ratings`,
    // 收藏课程
    COLLECT_COURSE: (courseId: number) => `/herb-teaching-service/courses/${courseId}/collections`,
    // 取消收藏课程
    UNCOLLECT_COURSE: (courseId: number) => `/herb-teaching-service/courses/${courseId}/collections`,
    // 获取用户收藏的课程列表
    GET_USER_COLLECTIONS: (params?: any) => `/herb-teaching-service/courses/collections${params ? '?' + new URLSearchParams(params).toString() : ''}`,
};

// 实验管理相关API
export const LAB_API = {
    // 获取课程的实验列表
    GET_COURSE_LABS: (courseId: number) => `/herb-teaching-service/courses/${courseId}/labs`,
    // 获取单个实验详情
    GET_LAB_DETAIL: (labId: number) => `/herb-teaching-service/labs/${labId}`,
    // 为课程新增实验
    CREATE_LAB: (courseId: number) => `/herb-teaching-service/courses/${courseId}/labs`,
    // 更新实验信息
    UPDATE_LAB: (labId: number) => `/herb-teaching-service/labs/${labId}`,
    // 删除实验
    DELETE_LAB: (labId: number) => `/herb-teaching-service/labs/${labId}`,
    // 获取所有实验（管理员用）
    GET_ALL_LABS: () => `/herb-teaching-service/labs`,
};

// 资源管理相关API
export const RESOURCE_API = {
    // 获取课程的资源列表
    GET_COURSE_RESOURCES: (courseId: number) => `/herb-teaching-service/courses/${courseId}/resources`,
    // 获取单个资源详情
    GET_RESOURCE_DETAIL: (resourceId: number) => `/herb-teaching-service/resources/${resourceId}`,
    // 为课程新增资源
    CREATE_RESOURCE: (courseId: number) => `/herb-teaching-service/courses/${courseId}/resources`,
    // 更新资源信息
    UPDATE_RESOURCE: (resourceId: number) => `/herb-teaching-service/resources/${resourceId}`,
    // 删除资源
    DELETE_RESOURCE: (resourceId: number) => `/herb-teaching-service/resources/${resourceId}`,
};

// 课程中草药管理相关API
export const COURSE_HERB_API = {
    // 获取课程关联的药材ID列表
    GET_COURSE_HERB_IDS: (courseId: number) => `/herb-teaching-service/courses/${courseId}/herbs`,
    // 添加单个药材到课程
    ADD_HERB_TO_COURSE: (courseId: number, herbId: number) => `/herb-teaching-service/courses/${courseId}/herbs/${herbId}`,
    // 批量更新课程的药材
    BATCH_UPDATE_COURSE_HERBS: (courseId: number) => `/herb-teaching-service/courses/${courseId}/herbs`,
    // 从课程中移除药材
    REMOVE_HERB_FROM_COURSE: (courseId: number, herbId: number) => `/herb-teaching-service/courses/${courseId}/herbs/${herbId}`,
};

// 中草药关联管理相关API
export const HERB_ASSOCIATION_API = {
    // 获取所有关联
    GET_ALL_ASSOCIATIONS: () => `/herb-service/herb-categories`,
    // 更新中草药的分类关联
    UPDATE_HERB_CATEGORIES: (herbId: number) => `/herb-service/herbs/${herbId}/categories`,
    // 删除关联
    DELETE_ASSOCIATION: (associationId: number) => `/herb-service/herb-categories/${associationId}`,
};