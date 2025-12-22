import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const RegisteredCamps = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: registrations = [], refetch, isLoading } = useQuery({
    queryKey: ["registrations", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/participants/organizer?email=${user.email}`
      );
      return res.data;
    },
  });

  const handleConfirm = async (id) => {
    await axiosSecure.patch(`/participants/confirm/${id}`);
    refetch();
  };

  const handleCancel = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This registration will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/participants/${item._id}`);
        refetch();
        Swal.fire("Cancelled!", "Registration removed.", "success");
      }
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.campName}</td>
                <td>${item.campFees}</td>
                <td>{item.participantName}</td>

                {/* Payment Status */}
                <td>
                  <span
                    className={`badge ${
                      item.paymentStatus === "Paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {item.paymentStatus}
                  </span>
                </td>

                {/* Confirmation */}
                <td>
                  {item.confirmationStatus === "Pending" ? (
                    <button
                      onClick={() => handleConfirm(item._id)}
                      className="btn btn-xs btn-warning"
                    >
                      Pending
                    </button>
                  ) : (
                    <span className="badge badge-success">Confirmed</span>
                  )}
                </td>

                {/* Cancel */}
                <td>
                  <button
                    onClick={() => handleCancel(item)}
                    disabled={
                      item.paymentStatus === "Paid" &&
                      item.confirmationStatus === "Confirmed"
                    }
                    className="btn btn-xs btn-error"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {registrations.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No registered participants found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisteredCamps;
