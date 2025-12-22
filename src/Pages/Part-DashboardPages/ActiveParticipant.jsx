import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ActiveParticipants = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: participants = [], isLoading, refetch } = useQuery({
    queryKey: ["activeParticipants"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/participants/active`);
      return res.data;
    },
  });

  const handleDeactivate = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This participant will be deactivated",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/participants/${id}/status`, {
          status: "inactive",
        });

        if (res.data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Deactivated",
            text: "Participant has been deactivated successfully",
          });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to deactivate participant",
        });
      }
    }
  };

  // Filter participants based on search term
 const filteredParticipants = participants.filter((p) =>
  p.participantName?.toLowerCase().includes(searchTerm.toLowerCase() || "")
);


  if (isLoading) {
    return <p className="text-center mt-10">Loading active participants...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 base-color">Active Participants</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by participant name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Camp</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.participantName}</td>
                <td>{p.participantEmail}</td>
                <td>{p.campName}</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeactivate(p._id)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveParticipants;
