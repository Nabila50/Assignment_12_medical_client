import { useParams, useNavigate, Link, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Modal from "react-modal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

Modal.setAppElement("#root"); // accessibility

const CampDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Fetch single camp
  const {
    data: camp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/camp-details/${id}`);
      return res.data;
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (formData) => {
    try {
      const participantData = {
        campId: camp._id,
        campName: camp.campName,
        campFees: camp.campFees,
        location: camp.location,
        healthcareProfessional: camp.healthcareProfessional,
        participantName: user.displayName,
        participantEmail: user?.email,
        age: formData.age,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        status: "pending",
        organizerEmail: camp.organizerEmail,
        organizerName: camp.organizerName,
        paymentStatus: "unpaid",
        confirmationStatus: "pending",
        joinedAt: new Date().toISOString(),
      };

      const response = await axiosSecure
        .post("/participants", participantData)
        .then((res) => {
          console.log(res.data.insertedId);
          if (res.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Successfully joined the camp!",
              timer: 2000,
              showConfirmButton: false,
            });
            reset();
            setModalIsOpen(false);
          }
        });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to join the camp",
        text: err.message,
      });
    }
  };

  if (isLoading)
    return <span className="loading loading-dots loading-xl bg-color"></span>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load camp.</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-sky-50 rounded-lg mt-10">
      <img
        src={camp.image}
        alt={camp.campName}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h2 className="text-4xl font-bold text-[#00bcd5] mb-4">
        {camp.campName}
      </h2>

      <div className="space-y-2 text-lg">
        <p>
          <strong>Date & Time:</strong> {camp.dateTime}
        </p>
        <p>
          <strong>Location:</strong> {camp.location}
        </p>
        <p>
          <strong>Healthcare Professional:</strong>{" "}
          {camp.healthcareProfessional}
        </p>
        <p>
          <strong>Fees:</strong> ${camp.campFees}
        </p>
        <p>
          <strong>Description:</strong> {camp.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {user ? (
          <>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Participant Registration"
              className="bg-white p-6 rounded-lg max-w-2xl mx-auto mt-10 max-h-[80vh] overflow-y-auto relative"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <button
                className="absolute top-2 right-2 text-red-500 font-bold"
                onClick={() => setModalIsOpen(false)}
              >
                X
              </button>

              <h3 className="text-2xl font-bold mb-4 base-color">
                Registration for Participation
              </h3>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Photo</label>
                  <img
                    src={user?.photoURL || ""}
                    className="w-30 h-20"
                    alt=""
                  />
                </div>
                {/* Read-only Camp Info */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Camp Name</label>
                  <input
                    type="text"
                    value={camp.campName}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Camp Fees</label>
                  <input
                    type="text"
                    value={camp.campFees}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Camp organizer</label>
                  <input
                    type="text"
                    value={camp.organizerEmail}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">
                    Camp Organizer Name
                  </label>
                  <input
                    type="text"
                    value={camp.organizerName}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={camp.location}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">
                    Healthcare Professional
                  </label>
                  <input
                    type="text"
                    value={camp.healthcareProfessional}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Participant Info */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Participant Name</label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">
                    Participant Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    {...register("age", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    {...register("phoneNumber", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Gender</label>
                  <select
                    {...register("gender", { required: true })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    {...register("address", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Emergency Contact"
                    {...register("emergencyContact", { required: true })}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    className="btn bg-[#00bcd5] text-white w-full"
                  >
                    Submit Registration
                  </button>
                </div>
              </form>
            </Modal>
            <button
              className="btn bg-[#00bcd5] text-white w-full"
              onClick={() => setModalIsOpen(true)}
            >
              Join Camp
            </button>
            <button
              className="btn btn-outline w-full"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <NavLink to="/register" className="btn bg-[#00bcd5] text-white w-full"> First Register Yourself</NavLink>
          </>
        )}
      </div>

      {/* React Modal */}
    </div>
  );
};

export default CampDetails;
