import axiosInstance from "@/api/config";


export const getHerbLocationsByName = (name:string) => {
    return axiosInstance.get(`/herb-info-service/herbs/location/herbname/${name}`)
}

export const getHerbsByLocation = (location:string) => {
    return axiosInstance.get(`herb-info-service/herbs/location/district/${location}`)
}

export const getAllHerbs = () => {
    return axiosInstance.get(`herb-info-service/herbs`)
}