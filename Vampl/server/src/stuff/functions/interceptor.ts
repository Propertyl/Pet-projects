import axios from "axios";

const serv = axios.create({
  baseURL:'http://localhost:3000'
});

serv.interceptors.response.use(
  res => res.data,
  error => Promise.reject(error)
);

export default serv;