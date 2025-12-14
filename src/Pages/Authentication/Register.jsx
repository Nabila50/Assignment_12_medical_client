import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
// import useAxios from "../../hooks/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async(result) => {
        console.log(result.user);

        //  update userinfo in the database
        const userInfo = {
          name: data.name,
          email: data.email,
          photo: data.profilePic,
          role:'user', // default role
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()

        }

        const userRes = await axiosInstance.post('/users', userInfo);
        console.log(userRes.data);

        //  update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile name & pic are updated");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ------------handle Image upload--------------

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);

    const formData = new FormData();
    formData.append("image", image);

    const imgUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imgUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-[#00bcd5]">Create An Account</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Full Name</label>
            <input
              type="name"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Full Name"
            />
            {/* Photo */}
            <label className="label">Your Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
              placeholder="Your Profile Picture"
            />

            {/* Age */}
            <label className="label">Age</label>
            <input
              type="age"
              {...register("age")}
              className="input"
              placeholder="Your Age"
            />

            {/* email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />

            {errors.email?.type === "required" && (
              <p className="text-red-500">Email is required</p>
            )}

            {/* password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Need Minimum 6 Character</p>
            )}
            <div>
              already have an account?
              <Link
                to="/login"
                className="link link-hover text-[#00bcd5] font-bold"
              >
                {" "}
                Login
              </Link>
            </div>
            <button className="btn btn-color mt-4">Register</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Register;
