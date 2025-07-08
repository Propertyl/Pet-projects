import axios from "axios";

const server = axios.create({
  baseURL:'http://localhost:3000',
  withCredentials:true
});

server.interceptors.response.use(
  res => res.data,
  error => Promise.reject(error),
);

export default server;