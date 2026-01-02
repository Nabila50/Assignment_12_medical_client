import { useState } from "react";
import { useParams, Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const FeedbackRating = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const { campId } = useParams();

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  // 🚫 If not logged in
  if (!user?.email) {
    return <Navigate to="/login" />;
  }

  // 🔄 Fetch participant data for this camp + user
  const { data: participant, isLoading } = useQuery({
    queryKey: ["participant", campId, user.email],
    enabled: !!campId && !!user.email,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/participants/profile/${campId}?email=${user.email}`
      );
      return res.data;
    },
  });

  // ⏳ Loading state
  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // ❌ No participant record
  if (!participant?._id) {
    return (
      <p className="text-center mt-10 text-red-500">
        You are not registered for this camp.
      </p>
    );
  }

  // 🔒 Block feedback if payment or confirmation incomplete
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
      const feedbackData = {
        participantId: participant._id,
        participantName: participant.participantName,
        participantEmail: participant.participantEmail,
        campId: participant.campId,
        campName: participant.campName,
        rating,
        feedback,
        createdAt: new Date(),
      };

      await axiosInstance.post("/feedbacks", feedbackData);

      Swal.fire("Thank you!", "Feedback submitted successfully", "success");
      setFeedback("");
      setRating(5);
    } catch (error) {
      Swal.fire("Error", "Failed to submit feedback", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-xl shadow mt-10">
      <h3 className="text-2xl font-bold text-[#00bcd5] mb-4">
        Give Feedback
      </h3>

      {/* Participant Info */}
      <div className="mb-4 text-sm text-gray-700">
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

      {/* Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`btn btn-sm ${
              rating >= num ? "btn-warning" : "btn-outline"
            }`}
          >
            ⭐
          </button>
        ))}
      </div>

      {/* Feedback Text */}
      <textarea
        className="textarea textarea-bordered w-full mb-4"
        placeholder="Write your feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      {/* Submit */}
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
