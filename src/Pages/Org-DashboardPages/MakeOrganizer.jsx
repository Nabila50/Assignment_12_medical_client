import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MakeOrganizer = () => {
  const axiosSecure = useAxiosSecure();
  const [emailQuery, setEmailQuery] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Search users by email
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchUsers", searchEmail],
    enabled: !!searchEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/organizer/users/search?email=${searchEmail}`
      );
      return res.data;
    },
  });

  // Trigger search
  const handleSearch = () => {
    if (!emailQuery.trim()) {
      Swal.fire("Warning", "Please enter an email", "warning");
      return;
    }
    setSearchEmail(emailQuery.trim());
  };

  const {mutateAsync: updateRole} = useMutation({
    mutationFn: async ({ id, role}) =>
      await axiosSecure.patch(`/organizer/users/${id}/make-organizer`, { role }),
    onSuccess: () =>{
      refetch();
    }
  });
 
  //  Make / Remove Organizer  
  const handleRoleChange = async (id, currentRole) => {
  const isOrganizer = currentRole === "organizer";
  const newRole = isOrganizer ? "user" : "organizer";

  const actionText = isOrganizer
    ? "Remove Organizer"
    : "Make Organizer";

  const confirm = await Swal.fire({
    title: `${actionText}?`,
    text: `Are you sure you want to ${actionText.toLowerCase()}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });

  if (!confirm.isConfirmed) return;

  try {
    await updateRole({ id, role: newRole });

    Swal.fire(
      "Success",
      `${actionText} successful`,
      "success"
    );
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to update role", "error");
  }
};


  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Organizer Management
      </h2>

      {/*Search Section */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search user by email"
          className="input input-bordered w-full"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-info">
          Search
        </button>
      </div>

      {isLoading && (
        <p className="text-center font-medium">Searching users...</p>
      )}

      {/* Result Table */}
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra custom-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "organizer"
                          ? "badge-success bg-[#00d515da]"
                          : "badge-ghost"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm  ${
                        user.role === "organizer"
                          ? "bg-[#d50000ee] text-white"
                          : "btn-color "
                      }`}
                      onClick={() =>
                        handleRoleChange(user._id, user.role)
                      }
                    >
                      {user.role === "organizer"
                        ? "Remove Organizer"
                        : "Make Organizer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && searchEmail && users.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No users found
        </p>
      )}
    </div>
  );
};

export default MakeOrganizer;
