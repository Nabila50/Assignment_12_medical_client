import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    data: registrations = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["registeredCamps", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/participants/registered/${user.email}`
      );
      return res.data;
    },
  });

  // ❌ Cancel registration
  const handleCancel = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This registration will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });

    if (result.isConfirmed) {
      await axiosInstance.delete(
        `/participants/registered/${item.campId}`
      );
      refetch();
      Swal.fire("Cancelled!", "Registration removed.", "success");
    }
  };

  // 👉 Go to feedback page
 const handleFeedback = (item) => {
  navigate(`/dashboard/feedback/${item._id}`);
};
  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-lg shadow mb-10">
      <h2 className="text-3xl font-bold text-[#00bcd5] mb-6">
        Registered Camps
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-[#00bcd5] text-white">
            <tr>
              <th>#</th>
              <th>Camp Name</th>
              <th>Fees</th>
              <th>Participant</th>
              <th>Payment</th>
              <th>Confirmation</th>
              <th>Cancel</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((item, index) => {
              const isPaid = item.paymentStatus === "paid";
              const isConfirmed =
                item.confirmationStatus === "confirmed";

              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.campName}</td>
                  <td>${item.campFees}</td>
                  <td>{item.participantName}</td>

                  {/* Payment */}
                  <td>
                    <span
                      className={`badge ${
                        isPaid ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>

                  {/* Confirmation */}
                  <td>
                    <span
                      className={`badge ${
                        isConfirmed
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {item.confirmationStatus}
                    </span>
                  </td>

                  {/* Cancel */}
                  <td>
                    <button
                      onClick={() => handleCancel(item)}
                      disabled={isPaid && isConfirmed}
                      className="btn btn-xs btn-error"
                    >
                      Cancel
                    </button>
                  </td>

                  {/* Feedback */}
                  <td>
                    {isPaid && isConfirmed ? (
                      <button
                        onClick={() =>
                          handleFeedback(item.campId)
                        }
                        className="btn btn-xs bg-[#00bcd5] text-white"
                      >
                        Feedback
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Not Available
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {registrations.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No registered camps found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisteredCamps;
