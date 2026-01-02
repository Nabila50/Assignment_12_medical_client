import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const COLORS = ["#00bcd5", "#4ade80", "#f97316", "#a855f7"];

const Analytics = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["participantAnalytics", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/analytics/participant?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading analytics...</p>;
  }

  /* ---------------- Chart Data ---------------- */

 
  const feeChartData = registrations.map((r) => ({
    name: r.campName,
    fees: Number(r.campFees),
  }));

 
  const paymentSummary = [
    {
      name: "Paid",
      value: registrations.filter((r) => r.paymentStatus === "paid").length,
    },
    {
      name: "Unpaid",
      value: registrations.filter((r) => r.paymentStatus === "unpaid").length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 mb-10 ">
      <h2 className="text-3xl font-bold text-[#00bcd5] mb-8">
        My Camp Analytics
      </h2>

      {/* -------- Summary Cards -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-base-200 p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold">Total Camps</h3>
          <p className="text-3xl text-[#00bcd5] mt-2">{registrations.length}</p>
        </div>

        <div className="bg-base-200 p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold">Paid Camps</h3>
          <p className="text-3xl text-green-500 mt-2">
            {paymentSummary[0].value}
          </p>
        </div>

        <div className="bg-base-200 p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold">Unpaid Camps</h3>
          <p className="text-3xl text-orange-500 mt-2">
            {paymentSummary[1].value}
          </p>
        </div>
      </div>

      {/* -------- Bar Chart -------- */}
      <div className="bg-base-200 p-6 rounded-lg shadow mb-10">
        <h3 className="text-xl font-bold mb-4">Camp Fees Overview</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feeChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="fees" fill="#00bcd5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* -------- Pie Chart -------- */}
      <div className="bg-base-200 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Payment Status Distribution</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentSummary}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {paymentSummary.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
