// ------------------- UpdateCamp.jsx -------------------
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const UpdateCamp = () => {
 
  const { register, handleSubmit, reset,formState: { errors }, } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { campId } = useParams();
   
  const navigate = useNavigate();

  // -------- Fetch Single Camp Details --------
  useEffect(() => {
    axiosSecure.get(`/orgDashboard/camp/${campId}`).then((res) => {
 
      reset(res.data); // Fill form with existing values
    });
  }, [campId, axiosSecure, reset]);

  // -------- Update Camp Handler --------
  const onSubmit = (data) => {
    axiosSecure.put(`/orgDashboard/update-camp/${campId}`, data)
 
      .then((res) => {
        if (res.data.modifiedCount) {
          Swal.fire({
            title: "Updated!",
            text: "Camp updated successfully!",
            icon: "success",
            timer: 1500,
          });
          navigate("/orgDashboard/manageCamps");
        }
      })
      .catch(() => {
        Swal.fire("Error!", "Failed to update camp", "error");
      });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10 base-color  ">
        Update Medical Camp
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Camp Name */}
        <div>
          <label className="label">Camp Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("campName", { required: true })}
          />
          {errors.campName && (
            <p className="text-red-600 text-sm">Camp Name is required</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="label">Camp Image URL</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("image", { required: true })}
          />
          {errors.image && (
            <p className="text-red-600 text-sm">Image URL is required</p>
          )}
        </div>

        {/* Max Participants */}
        <div>
          <label className="label">Max Participants</label>
          <input
            type="number"
            className="input input-bordered w-full"
            {...register("maxParticipants")}
          />
        </div>
        {/* Camp category */}
        <div>
          <label className="label">Camp Category</label>
          <select
            className="select select-bordered w-full"
            {...register("category")}
          >
            <option>General Health</option>
            <option>Eye Checkup</option>
            <option>Dental Camp</option>
            <option>Blood Donation</option>
            <option>Specialist Consultation</option>
          </select>
        </div>

        {/* Camp Fees */}
        <div>
          <label className="label">Camp Fees ($)</label>
          <input
            type="number"
            className="input input-bordered w-full"
            {...register("campFees", { required: true, min: 0 })}
          />
          {errors.campFees && (
            <p className="text-red-600 text-sm">Valid Camp Fee is required</p>
          )}
        </div>

        {/* Date & Time */}
        <div>
          <label className="label">Date & Time</label>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
            {...register("dateTime", { required: true })}
          />
          {errors.dateTime && (
            <p className="text-red-600 text-sm">Date & Time is required</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <p className="text-red-600 text-sm">Location is required</p>
          )}
        </div>

        {/* Healthcare Professional */}
        <div>
          <label className="label">Healthcare Professional Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("healthcareProfessional", { required: true })}
          />
          {errors.healthcareProfessional && (
            <p className="text-red-600 text-sm">
              Healthcare Professional Name is required
            </p>
          )}
        </div>

        {/* Description – Full Width */}
        <div className="lg:col-span-2">
          <label className="label">Camp Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows="4"
            {...register("description", { required: true })}
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm">Description is required</p>
          )}
        </div>

        {/* Submit Button – Full Width */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            className="btn btn-color hover:bg-[#0a446b] text-white w-full"
          >
            Update Camp
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCamp;
