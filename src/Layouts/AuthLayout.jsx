import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/login.png";
import Navbar from "../Pages/shared/Navbar";
import Footer from "../Pages/shared/Footer";

const AuthLayout = () => {
  return (
    <div>
      <div>
        <Navbar></Navbar>
      </div>

      <div className="hero bg-base-200 p-12 justify-center">
        <div className="hero-content flex-col lg:flex-row-reverse  gap-30">
          <div className="flex-1">
            <img src={authImg} className="max-w-sm rounded-lg shadow-2xl" />
          </div>
          <div className="flex-1">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AuthLayout;
