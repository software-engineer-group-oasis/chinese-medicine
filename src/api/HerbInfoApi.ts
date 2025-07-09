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