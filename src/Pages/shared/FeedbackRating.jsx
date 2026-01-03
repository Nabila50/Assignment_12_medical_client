import { useState } from "react";
import { useParams, Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const FeedbackRating = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const { participantId } = useParams();

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  if (!user?.email) return <Navigate to="/login" />;

  const { data: participant = {}, isLoading } = useQuery({
    queryKey: ["participant-feedback", participantId],
    enabled: !!participantId,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/participants/feedback/${participantId}`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

   if (!participant) {
    return (
      <p className="text-center mt-10 text-red-500">
        You are not registered for this camp.
      </p>
    );
  }

 if (
  participant.paymentStatus !== "paid" 
  // participant.confirmationStatus !== "confirmed"
) {
  return (
    <p className="text-center mt-10 text-yellow-600">
      Feedback is available only after payment and confirmation.
    </p>
  );
}


 

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
    } catch {
      Swal.fire("Error", "Failed to submit feedback", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-xl shadow mt-10">
      <h3 className="text-2xl font-bold text-[#00bcd5] mb-4">Give Feedback</h3>

      <div className="mb-4 text-sm">
        <p>
          <strong>Participant:</strong> {participant.participantName}
        </p>
        <p>
          <strong>Email:</strong> {participant.participantEmail}
        </p>
        <p>
          <strong>Camp:</strong> {participant.campName}
        </p>
      </div>

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

      <textarea
        className="textarea textarea-bordered w-full mb-4"
        placeholder="Write your feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={!feedback.trim()}
        className="btn bg-[#00bcd5] text-white w-full"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackRating;
