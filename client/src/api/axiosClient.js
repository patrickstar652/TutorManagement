import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

// 請求攔截器，檢查有沒有jwt，有沒有登入
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 回應攔截器，失敗的話代表token過期，清掉localStorage的token，並且觸發auth:expired事件
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }

    return Promise.reject(error);
  }
);

// 最後流程跑完，資料回傳到這裡，真正response的資料
export const unwrapData = (response) => response.data?.data ?? response.data;

export const getApiErrorMessage = (
  error,
  fallback = "操作失敗，請稍後再試"
) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
};

export default apiClient;
