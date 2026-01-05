import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const OrganizerProfile = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const email = user?.email;

  const { data: organizer = {}, isLoading } = useQuery({
    queryKey: ["organizerProfile", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/organizerProfile/${email}`);
      return res.data;
    },
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // ✅ sync data
  useEffect(() => {
    setFormData(organizer);
  }, [organizer]);

  const handleUpdate = async () => {
    const res = await axiosSecure.put(
      `/organizerProfile/update/${email}`,
      formData
    );

    if (res.data.modifiedCount > 0 || res.data.upsertedCount > 0) {
      Swal.fire("Updated!", "Profile updated successfully.", "success");
      setEditing(false);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg mt-10 shadow-md">

      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <img
          src={user?.photoURL || "https://i.ibb.co/ZmFq5tg/default.png"}
          alt="Organizer"
          className="w-32 h-32 rounded-full object-cover border-2 border-[#00bcd5]"
        />

        <div>
          <h2 className="text-3xl font-bold text-[#00bcd5]">
            {organizer.organizerName || "Organizer"}
          </h2>
          <p className="text-gray-600">{organizer.organizerEmail}</p>
        </div>
      </div>

      {!editing ? (
        <div className="mt-6 space-y-3 text-lg">
          <p><strong>Name:</strong> {organizer.organizerName || "Not Provided"}</p>
          <p><strong>Email:</strong> {organizer.organizerEmail}</p>
          <p><strong>Age:</strong> {organizer.age || 0}</p>
          <p><strong>Contact Number:</strong> {organizer.phoneNumber || 0}</p>
          

          <button
            onClick={() => setEditing(true)}
            className="btn bg-[#00bcd5] text-white mt-6"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <input
            className="input input-bordered w-full"
            value={formData.organizerName || ""}
            onChange={(e) =>
              setFormData({ ...formData, organizerName: e.target.value })
            }
            placeholder="Full Name"
          />

          <input
            className="input input-bordered w-full"
            value={formData.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Phone Number"
          />

          <input
            className="input input-bordered w-full"
            value={formData.photoURL || ""}
            onChange={(e) =>
              setFormData({ ...formData, photoURL: e.target.value })
            }
            placeholder="Photo URL"
          />

          <textarea
            className="textarea textarea-bordered w-full"
            value={formData.bio || ""}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            placeholder="Bio"
          />

          <button onClick={handleUpdate} className="btn bg-[#00bcd5] text-white">
            Save Changes
          </button>

          <button
            onClick={() => setEditing(false)}
            className="btn btn-outline ml-3"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizerProfile;
