import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const FeedbackRating = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 🔐 Auth guard
  if (!user?.email) return <Navigate to="/login" />;

  // 🔄 Fetch participant
  const { data: participant = {}, isLoading } = useQuery({
    queryKey: ["participant-feedback", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosInstance.get(`/participants/feedback/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!participant?._id) {
    return (
      <p className="text-center mt-10 text-red-500">
        You are not registered for this camp.
      </p>
    );
  }

  // 🔒 Payment + confirmation check
  if (
    participant.paymentStatus !== "paid" ||
    participant.confirmationStatus !== "confirmed"
  ) {
    return (
      <p className="text-center mt-10 text-yellow-600">
        Feedback is available only after payment and confirmation.
      </p>
    );
  }

  // 📤 Submit feedback
  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/feedbacks", {
        participantId: participant._id,
        participantName: participant.participantName,
        participantEmail: participant.participantEmail,
        campId: participant.campId,
        campName: participant.campName,
        rating,
        feedback,
        createdAt: new Date(),
      });

      Swal.fire("Thank you!", "Feedback submitted successfully", "success");
      setFeedback("");
      setRating(5);
      setSubmitted(true);
      navigate("/partiDashboard/registeredCamps");
    } catch {
      Swal.fire("Error", "Failed to submit feedback", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-xl shadow mt-10">
      <h3 className="text-2xl font-bold text-[#00bcd5] mb-6">Give Feedback</h3>

      {/* 🧑 Participant Card */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-[#00bcd5] ring-offset-2">
            <img
              src={
                user.photoURL || "https://i.ibb.co/2kR8f6T/user-placeholder.png"
              }
              alt="Participant"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-lg">{participant.participantName}</p>
          <p>{participant.participantEmail}</p>
          <p className="text-xs text-gray-500">Camp: {participant.campName}</p>
        </div>
      </div>

      {/* ⭐ Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setRating(num)}
            className={`btn btn-sm ${
              rating >= num ? "btn-warning" : "btn-outline"
            }`}
          >
            ⭐
          </button>
        ))}
      </div>

      {/* 📝 Feedback */}
      <textarea
        className="textarea textarea-bordered w-full mb-4"
        placeholder="Write your feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={!feedback.trim() || submitted}  
        className="btn bg-[#00bcd5] text-white w-full"
      >
         {submitted ? "Feedback Submitted" : "Submit Feedback"}
      </button>
    </div>
  );
};

export default FeedbackRating;
