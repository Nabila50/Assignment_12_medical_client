import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const ParticipantPayment = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

const { data: payments = [], isLoading } = useQuery({
  queryKey: ["paymentHistory", user?.email],
  enabled: !!user?.email,
  queryFn: async () => {
    const res = await axiosSecure.get(
      `participants/registered/${user.email}`
    );
    return res.data;
  },
});
  //   handle pay-----------

  const handlePay = (id) => {
    navigate(`/orgDashboard/payment/${id}`, {
      state: { from: "manageCamps" },
    });
  };
 
  // -------------handle View---------------

  const handleView = (id) => {};

 

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This registration will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/organizer/cancel/${id}`);
      refetch();
      Swal.fire("Cancelled!", "Registration removed.", "success");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="w-full mx-auto mt-10 px-5 mb-10 ">
      <h2 className="text-3xl font-bold mb-6 text-[#00bcd5]">
        Pay for Camp Registration
      </h2>

      <div className="overflow-x-auto rounded-2xl">
        <table className="table table-zebra bg-color  ">
          <thead className="bg-[#00bcd5]">
            <tr className="rounded-2xl">
              <th>Participant</th>
              <th>Participant Email</th>
              <th>Camp Name</th>
              <th>Fees</th>
              <th>Payment</th>
              <th>Confirmation</th>
              <th>Cancel</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => {
              const isLocked =
                p.paymentStatus === "paid" &&
                p.confirmationStatus === "confirmed";

              return (
                <tr key={p._id}>
                  <td>{p.participantName}</td>
                  <td>{p.participantEmail}</td>
                  <td>{p.campName}</td>
                  <td>${p.campFees}</td>

                  {/* Payment Status */}
                  <td>
                    <span
                      className={`badge ${
                        p.paymentStatus === "paid"
                          ? "bg-lime-500"
                          : "bg-red-500"
                      }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>

                  {/* Confirmation Status */}
                  <td>
                    {p.confirmationStatus === "pending" ? (
                      <span className="badge bg-yellow-300">Pending</span>
                    ) : (
                      <span className="badge bg-lime-500">Confirmed</span>
                    )}
                  </td>

                  {/* ✅ ACTION COLUMN */}
                  <td className="flex gap-2">
                    {/* View */}
                    <button
                      onClick={() => console.log("View", p._id)}
                      className="btn btn-xs btn-info text-white"
                    >
                      View
                    </button>

                    {/* Pay (disabled for organizer) */}
                    {p.paymentStatus === "unpaid" && (
                      <button
                        onClick={() => handlePay(p._id)}
                        className="btn btn-xs btn-success opacity-60"
                      >
                        Pay
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleCancel(p._id)}
                      disabled={isLocked}
                      className="btn btn-xs bg-red-500 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No registrations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ParticipantPayment;
