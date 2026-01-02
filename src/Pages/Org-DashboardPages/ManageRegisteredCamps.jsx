import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ManageRegisteredCamps = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: participants = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["organizerParticipants", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/organizer/participants?email=${user.email}`
      );
      return res.data.participants;
    },
  });

  const handleConfirm = async (id) => {
    try {
      await axiosSecure.patch(`/organizer/confirm/${id}`);
      Swal.fire("Confirmed!", "Participant confirmed successfully", "success");
      refetch();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to confirm",
        "error"
      );
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="w-full mx-auto mt-10 px-3">
      <h2 className="text-3xl font-bold mb-6 text-[#00bcd5]">
        Manage Registered Camps
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-base-300">
            <tr>
              <th>Participant</th>
              <th>Email</th>
              <th>Camp</th>
              <th>Fees</th>
              <th>Payment</th>
              <th>Confirmation</th>
            </tr>
          </thead>

          <tbody>
            {participants.map((p) => (
              <tr key={p._id}>
                <td>{p.participantName}</td>
                <td>{p.participantEmail}</td>
                <td>{p.campName}</td>
                <td>${p.campFees}</td>

                {/* Payment */}
                <td>
                  <span
                    className={`badge ${
                      p.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>

                {/* Confirmation */}
                <td>
                  {p.confirmationStatus === "confirmed" ? (
                    <span className="badge badge-success">Confirmed</span>
                  ) : (
                    <button
                      onClick={() => handleConfirm(p._id)}
                      disabled={p.paymentStatus !== "paid"}
                      className="btn btn-xs btn-warning"
                    >
                      Pending
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {participants.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No registrations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageRegisteredCamps;
