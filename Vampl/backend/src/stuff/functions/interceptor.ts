import axios from "axios";

const serv = axios.create({
  baseURL:'http://localhost:3000'
});

serv.interceptors.response.use(
  res => res.data,
  error => console.log(error)
);

export default serv;