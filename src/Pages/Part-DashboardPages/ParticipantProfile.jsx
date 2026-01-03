import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

Modal.setAppElement("#root");

const ParticipantProfile = () => {
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Load participant profile from backend
  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["participantProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/participants/profile/${user.email}`);
      return res.data;
    },
  });

  const openModal = () => {
    setFormData(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatePayload = {
      participantName: formData.participantName,
      phoneNumber: formData.phoneNumber,
      emergencyContact: formData.emergencyContact,
      image: formData.image,
      location: formData.location,
      age: formData.age,
      organizerEmail: camp.organizerEmail, 
      organizerName: camp.organizerName,
      participantName: user.displayName,
      participantEmail: user.email,
      paymentStatus: "unpaid",
      confirmationStatus: "pending",
    };
    try {
      const res = await axiosSecure.patch(
        `/participants/profile/${profile._id}`,
        updatePayload
      );

      console.log(res);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Profile updated successfully",
        });
        closeModal();
        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile",
      });
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="w-130 h-100 max-w-7xl mx-auto p-12 bg-color rounded-xl shadow-lg my-20">
      <h2 className="text-3xl font-bold mb-4">My Profile</h2>

      <div className="flex items-center gap-6">
        <img
          src={profile?.image || user?.photoURL}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover"
        />
        <div className="space-y-1">
          <p>
            <strong>Name:</strong> {profile?.participantName}
          </p>
          <p>
            <strong>Email:</strong> {profile?.participantEmail}
          </p>
          <p>
            <strong>Age:</strong> {profile?.age}
          </p>
          <p>
            <strong>Gender:</strong> {profile?.gender}
          </p>
          <p>
            <strong>Phone:</strong> {profile?.phoneNumber}
          </p>
          <p>
            <strong>Emergency Contact:</strong> {profile?.emergencyContact}
          </p>
          <p>
            <strong>Location:</strong> {profile?.location}
          </p>
          <button className="btn btn-info mt-6" onClick={openModal}>
            Update Profile
          </button>
        </div>
      </div>

      {/* Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-xl font-bold mb-4">Update Profile</h3>

        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            name="participantName"
            value={formData?.participantName || ""}
            onChange={handleChange}
            placeholder="Name"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="phoneNumber"
            value={formData?.phoneNumber || ""}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="emergencyContact"
            value={formData?.emergencyContact || ""}
            onChange={handleChange}
            placeholder="Emergency Contact"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="image"
            value={formData?.image || ""}
            onChange={handleChange}
            placeholder="Profile Image URL"
            className="input input-bordered w-full"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ParticipantProfile;
