import axios from "axios";
import React from "react";
import useAuth from "./useAuth";

 
 const axiosInstance = axios.create({
     baseURL: `https://medical-server-ashy.vercel.app`
 })

const useAxios = () => {
 
  return axiosInstance;
};

export default useAxios;


 