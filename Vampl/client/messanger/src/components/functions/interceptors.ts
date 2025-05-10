import axios from "axios";

const serv = axios.create({
  baseURL:"http://localhost:3000",
  withCredentials:true
});

serv.interceptors.response.use(
  response => response.data,
  async error => {
     const config = error.config;

     if(!config || config.__retry) {
        return Promise.reject(error);
     }

     config.__retry = true;

     await new Promise(resolve => setTimeout(resolve,1000));
     return serv(config);
  }
);

export default serv;