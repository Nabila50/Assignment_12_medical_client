import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const RegisteredCamps = () => {
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: registrations = [], refetch, isLoading } = useQuery({
    queryKey: ["registrations", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/participants/registered/${user.email}`
      );
      return res.data;
    },
  });

  const handleCancel = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This registration will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosInstance.delete(
          `/participants/registered/${item.campId}`
        );
        refetch();
        Swal.fire("Cancelled!", "Registration removed.", "success");
      }
    });
  };

  // 👉 Navigate to feedback page
  const handleFeedback = (item) => {
    navigate(`/dashboard/feedback/${item.campId}`, {
      state: item,
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-lg shadow mb-10">
      <h2 className="text-3xl font-bold text-[#00bcd5] mb-6">
        Registered Camps
      </h2>

      <div className="overflow-x-auto rounded-2xl">
        <table className="table table-zebra w-full bg-color">
          <thead className="bg-[#00bcd5] text-white">
            <tr>
              <th>#</th>
              <th>Camp Name</th>
              <th>Fees</th>
              <th>Participant</th>
              <th>Payment</th>
              <th>Confirmation</th>
              <th>Action</th>
              <th>Feedback</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((item, index) => {
              const isPaid = item.paymentStatus === "paid";

              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.campName}</td>
                  <td>${item.campFees}</td>
                  <td>{item.participantName}</td>

                  <td>
                    <span
                      className={`badge ${
                        isPaid ? "bg-lime-300" : "bg-yellow-300"
                      }`}
                    >
                      {item.paymentStatus}
                    </span>
                  </td>

                  <td>
                    {item.confirmationStatus === "pending" ? (
                      <span className="badge bg-yellow-300">Pending</span>
                    ) : (
                      <span className="badge bg-lime-500">Confirmed</span>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => handleCancel(item)}
                      disabled={
                        isPaid && item.confirmationStatus === "confirmed"
                      }
                      className="btn btn-xs bg-red-600 text-black"
                    >
                      Cancel
                    </button>
                  </td>

                  {/* ✅ Feedback button */}
                  <td>
                    {isPaid ? (
                      <button
                        onClick={() => handleFeedback(item)}
                        className="btn btn-xs bg-[#00bcd5] text-white"
                      >
                        Feedback
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Pay first
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
