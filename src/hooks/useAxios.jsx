import axios from "axios";
import React from "react";
import useAuth from "./useAuth";

 
 const axiosInstance = axios.create({
     baseURL: `http://localhost:5000`
 })

const useAxios = () => {
 
  return axiosInstance;
};

export default useAxios;


 