import { useState } from "react";
import axiosInstance from "@/api/config";
import { message } from "antd";


//和useAxios功能类似，但是不是刷新就触发，是手动触发
interface UseRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  get: (url: string, params?: unknown) => Promise<T | null>;
  post: (url: string, body?: unknown, params?: unknown) => Promise<T | null>;
  put: (url: string, body?: unknown, params?: unknown) => Promise<T | null>;
  del: (url: string, params?: unknown, body?: unknown) => Promise<T | null>;
}

function useRequest<T = unknown>(): UseRequestResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = async (
    method: "get" | "post" | "put" | "delete",
    url: string,
    body?: unknown,
    params?: unknown
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      let res;
      switch (method) {
        case "get":
          res = await axiosInstance.get(url, { params });
          break;
        case "post":
          res = await axiosInstance.post(url, body, { params });
          break;
        case "put":
          res = await axiosInstance.put(url, body, { params });
          break;
        case "delete":
          res = await axiosInstance.delete(url, {
            data: body,
            params,
          });
          break;
      }

      if (res.data.code === 0) {
        setData(res.data);
        return res.data;
      } else {
        const err = new Error(res.data.message || "请求失败");
        setError(err);
        console.error(err.message);
        return null;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        console.error(err.message || "请求出错");
      } else {
        const fallbackError = new Error("未知错误");
        setError(fallbackError);
        console.error("请求出错");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    get: (url, params) => request("get", url, null, params),
    post: (url, body, params) => request("post", url, body, params),
    put: (url, body, params) => request("put", url, body, params),
    del: (url, params, body) => request("delete", url, body, params),
  };
}

export default useRequest;
