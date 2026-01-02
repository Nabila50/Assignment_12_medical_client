import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
// import withReactContent from "sweetalert2-react-content";

const AddCamp = ({ onSubmitCamp }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

 const onSubmit = (data) => {
  const campData = {
    ...data,
    participantCount: 0,
    organizerEmail: user?.email,
    organizerName: user?.displayName || "Unknown Organizer",
    creation_date: new Date().toISOString(),
    status: "upcoming",
    maxParticipants: data.maxParticipants || 50,
    category: data.category || "General Health",
  };

  axiosSecure
    .post("/addCamps", campData)
    .then((res) => {
      console.log("Camp saved to database:", res.data);
      if(res.data.insertedId){

        Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Camp created successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      reset();

      }

      
    })
    .catch((err) => {
      console.error("Error saving camp:", err);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to save camp. Try again!",
      });
    });
};


  return (
    <div className="p-8 max-w-7xl mx-auto my-10 bg-base-200  rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center mb-10 base-color  ">
        Create a Medical Camp
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
            Create Camp
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCamp;
