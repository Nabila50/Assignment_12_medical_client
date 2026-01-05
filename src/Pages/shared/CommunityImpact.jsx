import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";

const CommunityImpact = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  // Fetch verified feedbacks
  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["verifiedFeedbacks"],
    queryFn: async () => {
      const res = await axiosInstance.get("/feedbacks/verified");
      return res.data;
    },
  });

  // Fetch impact stats
  const { data: stats = {} } = useQuery({
    queryKey: ["impactStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/stats/impact");
      return res.data;
    },
  });

  if (isLoading) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-5">
        <h2 className="text-4xl font-bold text-[#00bcd5] mb-3">
          Community Impact & Trust
        </h2>
        <p className="text-gray-600 mx-auto">
          Real stories from verified participants who joined our medical camps
          and made a difference.
        </p>
      </div>

      {/* Feedback Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-5">
        {feedbacks.slice(0, 6).map((fb) => (
          <div
            key={fb._id}
            onClick={() =>
              navigate(`/partiDashboard/registered-camps`)
            }
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-6 border"
          >
            {/* Participant */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={
                  fb.participantPhoto ||
                  "https://i.ibb.co/ZYW3VTp/brown-brim.png"
                }
                alt={fb.participantName}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h4 className="font-semibold">
                  {fb.participantName}
                </h4>
                <p className="text-xs text-gray-500">
                  {fb.campName}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < fb.rating ? "⭐" : "☆"}
                </span>
              ))}
            </div>

            {/* Feedback */}
            <p className="text-sm text-gray-600 line-clamp-3">
              {fb.feedback}
            </p>

            <p className="mt-3 text-xs text-[#00bcd5] font-medium">
              View Registered Camp →
            </p>
          </div>
        ))}
      </div>

      {/* Impact Stats */}
      <div className="grid md:grid-cols-4 gap-6 text-center">
        <StatCard label="Medical Camps" value={stats.camps || 0} />
        <StatCard label="Participants" value={stats.participants || 0} />
        <StatCard label="Verified Feedbacks" value={stats.feedbacks || 0} />
        <StatCard label="Avg Rating" value={`${stats.rating || 0} ★`} />
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-[#f0fcff] rounded-xl p-6 shadow-sm">
    <h3 className="text-3xl font-bold text-[#00bcd5]">
      {value}
    </h3>
    <p className="text-gray-600 mt-1">{label}</p>
  </div>
);

export default CommunityImpact;
