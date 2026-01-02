import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const beAParticipant = ({ camp, user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      participantName: user?.name || "",
      participantEmail: user?.email || "",
    },
  });

  const {createUser} = useAuth()
  // handle register on button click
  const handleRegister = (event) => {
    event.preventDefault(); // prevent default form submission

    const formData = {
      campName: camp?.campName,
      campFees: camp?.campFees,
      location: camp?.location,
      healthcareProfessional: camp?.healthcareProfessional,
      participantName: user?.name,
      participantEmail: user?.email,
      organizerEmail: camp.organizerEmail, // ✅ ADD THIS
      organizerName: camp.organizerName,
      paymentStatus: "unpaid",
      confirmationStatus: "pending",
  
      creation_date: new Date().toISOString(),
    };

    console.log("Participant saved:", formData);

    // SweetAlert2 toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Registration Successful!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    reset();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center text-[#00bcd5]">
        Participant Registration Form
      </h1>
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-10">
        {/* Camp Name */}
        <div>
          <label className="label">Camp Name</label>
          <input
            type="text"
            value={camp?.campName}
            readOnly
            className="input input-bordered w-full bg-gray-100"
            {...register("campName")}
          />
        </div>

        {/* Camp Fees */}
        <div>
          <label className="label">Camp Fees</label>
          <input
            type="text"
            value={camp?.campFees}
            readOnly
            className="input input-bordered w-full bg-gray-100"
            {...register("campFees")}
          />
        </div>

          {/* Participant Name */}
        <div>
          {" "}
          <label className="label">Participant Name</label>{" "}
          <input
            type="text"
            // readOnly
            className="input input-bordered w-full bg-color"
            {...register("participantName", { required: true })}
          />{" "}
        </div>

        {/* Participant Email */}
        <div>
          {" "}
          <label className="label">Participant Email</label>{" "}
          <input
            type="email"
            // readOnly
            className="input input-bordered w-full bg-color"
            {...register("participantEmail", { required: true })}
          />{" "}
        </div>

        {/* Other inputs: Age, Phone, Gender, Emergency Contact */}
        <div>
          <label className="label">Age</label>
          <input
            type="number"
            className="input input-bordered w-full"
            {...register("age", { required: true, min: 1 })}
          />
          {errors.age && (
            <p className="text-red-600 text-sm">Age is required</p>
          )}
        </div>

        <div>
          <label className="label">Phone Number</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("phone", { required: true })}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">Phone number is required</p>
          )}
        </div>

        <div>
          <label className="label">Gender</label>
          <select
            className="select select-bordered w-full"
            {...register("gender", { required: true })}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 text-sm">Gender is required</p>
          )}
        </div>

        <div>
          <label className="label">Emergency Contact</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("emergencyContact", { required: true })}
          />
          {errors.emergencyContact && (
            <p className="text-red-600 text-sm">
              Emergency contact is required
            </p>
          )}
        </div>

        <div>
          <label className="label">Payment Status</label>
          <select
            className="select select-bordered w-full"
            {...register("gender", { required: true })}
          >
            <option value="">Select Payment Status</option>
            <option>Paid</option>
            <option>Unpaid</option>
             
          </select>
          {errors.gender && (
            <p className="text-red-600 text-sm">Payment status is required</p>
          )}
        </div>

        {/* Register Button */}
        <div className="lg:col-span-2 mt-4">
          <button
            onClick={handleRegister}
            type="submit"
            className="btn btn-color hover:bg-[#014a7a] text-white w-full"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default beAParticipant;
