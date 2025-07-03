import {useEffect, useState} from "react";
import axiosInstance from "@/api/config";
import {message} from "antd";

const useAxios = (url:string, method="get", body=null, params=null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let res;
        switch (method.toLowerCase()) {
            case 'get':
                res = axiosInstance.get(url, {params})
                break;
            case 'post':
                res = axiosInstance.post(url, body, {params})
                break;
            case 'put':
                res = axiosInstance.put(url, body, {params})
                break;
            case 'delete':
                res = axiosInstance.delete(url, {params, data: body})
                break;
            default:
                throw new Error(`unsupported HTTP method: ${method}`)
        }

        res.then(result => {
            if (result.data.code === 0) {
                setData(result.data)
                console.log("from useAxios: ", result.data);
            } else {
                // @ts-ignore
                console.error(result.message)
                throw new Error(`请求${url}失败, method: ${method}`)
            }
        }).catch(error => {
            setError(error);
            console.error(error.message);
            message.error("请求API失败");
        }).finally(()=> {
            setLoading(false);
        })
    }, [url, method, body]);

    return {data, loading, error};
}

export default useAxios;