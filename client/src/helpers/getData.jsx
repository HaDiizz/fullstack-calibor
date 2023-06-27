import axios from "axios";

export const getDataAPI = async (url, params, token) => {
  const res = await axios.get(`${import.meta.env.VITE_SERVER_API}/${params}/${url}`, {
    headers: { Authorization: token, withCredentials: true },
  });
  return res;
};

export const getSearchGroup = async (url, token) => {
  const res = await axios.get(`${import.meta.env.VITE_SERVER_API}/${url}`, {
    headers: { Authorization: token, withCredentials: true },
  });
  return res;
};
