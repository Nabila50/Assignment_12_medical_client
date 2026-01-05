import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router";

const FeedbackCards = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const res = await axiosInstance.get("/feedbacks");
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading feedbacks...</p>;
  if (!feedbacks.length)
    return <p className="text-center mt-10 text-gray-500">No feedbacks yet.</p>;

  return (
    <div className="max-w-7xl mx-auto bg-base-100 px-7 py-5 mb-5">
      <div>
        <h1 className="text-3xl font-bold text-center text-[#00bcd5] mb-10">
          FeedBack From Our Participants
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.map((fb) => (
          <div
            key={fb._id}
            onClick={() =>
              navigate(`/partiDashboard/registeredCamps?campId=${fb.campId}`)
            }
            className="cursor-pointer bg-sky-50  p-6 rounded-xl shadow
                     hover:shadow-xl hover:scale-[1.02] transition
                     text-center"
          >
            <h3 className="text-lg font-bold text-[#00bcd5] mb-2">
              {fb.campName}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Participant:</strong> {fb.participantName}
            </p>
            <p className="text-sm text-yellow-600 mb-2">⭐ {fb.rating} / 5</p>
            <p className="text-gray-600">{fb.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackCards;
