import axios from "axios";

const serv = axios.create({
  baseURL:"http://localhost:3000",
  withCredentials:true
});

serv.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

export default serv;