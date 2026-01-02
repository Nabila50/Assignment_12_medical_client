import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { participantId } = useParams();
  const axiosSecure = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [error, setError] = useState("");

  const { isPending, data: participant } = useQuery({
    queryKey: ["participant", participantId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/participants/${participantId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <p className="text-center">Loading Participant info...</p>;
  }

 
  // console.log(campInfo);
  const amount = participant.campFees;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("Payment method:", paymentMethod);
    }

    // create payment intent

    const res = await axiosSecure.post("create-payment-intent", {
      amountInCents,
      participantId,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      error(result.error.message);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        console.log("payment succeeded!");
        console.log(result);
        const paymentData = {
          participantId,
          participantEmail: participant.participantEmail,
          participantName: participant.participantName,
          campId: participant.participantId,
          campName: participant.campName,
          amount: participant.campFees,
          paymentIntentId: result.paymentIntent.id,
          paymentMethod: "card",
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);

        // REFRESH organizer participants
        // queryClient.invalidateQueries(["organizerParticipants", user?.email]);
        queryClient.invalidateQueries({
          queryKey: ["organizerParticipants", user?.email],
        });

        // Go back
        navigate(-1);

        if (paymentRes.data.paymentId) {
          console.log("Payment Successfully");
        }
      }
    }

    console.log("res from intent", res);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-color p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
    >
      <h3 className="text-xl font-bold text-center">
        Pay for {participant.campName}
      </h3>

      <CardElement className="p-2 border rounded" />

      <button type="submit" className="btn btn-color w-full" disabled={!stripe}>
        Pay ${amount}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
};
export default PaymentForm;
