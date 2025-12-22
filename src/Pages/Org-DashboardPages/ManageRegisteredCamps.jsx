import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const ManageRegisteredCamps = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      return res.data;
    },
  });

//   handle pay-----------

  const handlePay = async (id) => {
    console.log('proceed to payment')
    navigate(`/orgDashboard/payment/${id}`)
//   try {
   
//     const res = await axiosSecure.post("/create-payment-session", {
//       participantId: participant._id,
//       campName: participant.campName,
//       campFees: participant.campFees,
//       participantEmail: participant.participantEmail,
//     });

//     // 2️⃣ Redirect to Stripe Checkout
//     const stripe = await stripePromise;
//     await stripe.redirectToCheckout({
//       sessionId: res.data.sessionId,
//     });

//   } catch (error) {
//     console.error("Payment error:", error);
//     Swal.fire("Error", "Payment failed. Try again.", "error");
//   }
};

// -------------handle View---------------

const handleView = (id) =>{

}

// ---------handle Confirm----------------

  const handleConfirm = async (id) => {
    await axiosSecure.patch(`/organizer/confirm/${id}`);
    refetch();
  };

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
    <div className="w-full mx-auto mt-10 px-3">
      <h2 className="text-3xl font-bold mb-6 text-[#00bcd5]">
        Manage Registered Camps
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-base-300">
            <tr>
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
            {participants.map((p) => {
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
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>

                  {/* Confirmation Status */}
                  <td>
                    {p.confirmationStatus === "pending" ? (
                      <button
                        onClick={() => handleConfirm(p._id)}
                        disabled={p.paymentStatus !== "paid"}
                        className="btn btn-xs btn-warning"
                      >
                        Pending
                      </button>
                    ) : (
                      <span className="badge badge-success">Confirmed</span>
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
                    {
                        p.paymentStatus === 'unpaid' &&(
                            <button onClick={()=> handlePay(p._id)}
                       
                      className="btn btn-xs btn-success opacity-60 cursor-not-allowed"
                    >
                      Pay
                    </button>

                    )}
                    
                    

                    {/* Delete */}
                    <button
                      onClick={() => handleCancel(p._id)}
                      disabled={isLocked}
                      className="btn btn-xs btn-error text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
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
