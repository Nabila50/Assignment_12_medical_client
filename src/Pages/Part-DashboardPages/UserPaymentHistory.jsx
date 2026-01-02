import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const UserPaymentHistory = () => {
  const { user } = useAuth();
  const axiosInstant = useAxios();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["userPaymentHistory", user.email],
    queryFn: async () => {
      const res = await axiosInstant.get(`/payments?email=${user.email}`);
      console.log("userPaymentHistory:", res.data);
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center">Loading Payment info...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto my-10 bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-[#00bcd5]">
        Payment History
      </h2>

      <div className="overflow-x-auto rounded-2xl">
        <table className="table table-zebra bg-color">
          <thead className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <tr>
              <th>#</th>
              <th>Participant Name</th>
              <th>Camp</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Paid At</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, index) => (
              <tr key={p._id} className="hover:bg-cyan-50 transition-colors">
                <td className="font-semibold">{index + 1}</td>
                <td className="font-medium text-blue-600">
                  {p.participantName}
                </td>
                <td className="font-medium ">{p.campName}</td>
                <td
                  className={`font-bold ${
                    p.amount >= 20 ? "text-orange-500" : "text-green-600"
                  }`}
                >
                  ${p.amount}
                </td>
                <td className="capitalize">{p.paymentMethod}</td>
                <td className="capitalize text-purple-600 font-medium">
                  <span className="badge bg-[#00bcd5]">{p.status}</span>
                </td>
                <td className="text-xs text-gray-500">
                  {p.paymentIntentId?.slice(0, 12)}...
                </td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No payment history found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserPaymentHistory;
