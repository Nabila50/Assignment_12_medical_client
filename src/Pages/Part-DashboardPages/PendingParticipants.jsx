import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

Modal.setAppElement("#root");

const PendingParticipants = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const { data: participants = [], isLoading, refetch } = useQuery({
    queryKey: ["pendingParticipants", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/participants/pending`);
      return res.data;
    },
  });

  const handleDecision = async (id, action, email)=>{
    const confirm = await Swal.fire({
      title: `${action === "approved" ? "Approve" : "Reject"} Application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

  try {
    const status = action === "approved" ? "active" : "rejected";
    const res = await axiosSecure.patch(`/participants/${id}/status`, {
      status,
      email
    });

      refetch();
 
      Swal.fire("Success", `Participant ${action} successfully`, "Success");
   
      // setSelectedParticipant(null);
    }catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to approve participant",
    });
  }
};


  const handleCancel = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This application will be cancelled",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/participants/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Cancelled!", "Application cancelled.", "success");
          refetch();
          setSelectedParticipant(null);
        }
      }
    });
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading pending participants...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 base-color">Pending Participants</h2>

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
            {participants.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.participantName}</td>
                <td>{p.participantEmail}</td>
                <td>{p.campName}</td>
                <td>
                  <span className="badge badge-warning">Pending</span>
                </td>
                <td className="space-x-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedParticipant(p)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleDecision(p._id, 'approved', p.participantEmail)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDecision(p._id, 'reject', p.participantEmail)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Participant Details Modal */}
      <Modal
        isOpen={!!selectedParticipant}
        onRequestClose={() => setSelectedParticipant(null)}
        className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedParticipant && (
          <div>
            <h3 className="text-xl font-bold mb-4">Participant Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedParticipant.participantName}</p>
              <p><strong>Email:</strong> {selectedParticipant.participantEmail}</p>
              <p><strong>Camp:</strong> {selectedParticipant.campName}</p>
              <p><strong>Age:</strong> {selectedParticipant.age}</p>
              <p><strong>Gender:</strong> {selectedParticipant.gender}</p>
              <p><strong>Phone:</strong> {selectedParticipant.phoneNumber}</p>
              <p><strong>Emergency Contact:</strong> {selectedParticipant.emergencyContact}</p>
              <p><strong>Location:</strong> {selectedParticipant.location}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="btn btn-success"
                onClick={() => handleDecision(selectedParticipant._id)}
              >
                Accept
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDecision(selectedParticipant._id)}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setSelectedParticipant(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );}


export default PendingParticipants;