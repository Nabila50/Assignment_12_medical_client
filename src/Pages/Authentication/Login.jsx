import React from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import SocialLogIn from "./SocialLogIn";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        console.log("user is here", result.user);
        navigate(from);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-[#00bcd5]">LogIn Here!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="Email"
            />

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500" role="alert">
                password is required
              </p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Password must be 6 characters</p>
            )}

            <div>
              New in here?
              <Link state={{from}}
                to="/register" 
                className="link link-hover text-[#00bcd5] font-bold"
              >
                {" "}
                Register
              </Link>
            </div>
          </fieldset>
          <button type="submit" className="btn mt-4 btn-color w-full">
            Login
          </button>
        </form>
        <SocialLogIn></SocialLogIn>
      </div>
    </div>
  );
};

export default Login;
