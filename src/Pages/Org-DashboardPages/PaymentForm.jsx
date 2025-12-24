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
  const { campId } = useParams();
  const axiosSecure = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [error, setError] = useState("");

  const { isPending, data: campInfo } = useQuery({
    queryKey: ["camps", campId],
    enabled: !!campId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/camps/${campId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <p className="text-center">Loading camp info...</p>;
  }

  // if (!campInfo?._id) {
  //   return <p className="text-center text-red-500">Camp not found</p>;
  // }

  console.log(campInfo);
  const amount = campInfo.campFees;
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
      campId,
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
          participantId: user.participantId,
          participantEmail: user.email,
          participantName: user.displayName,
          campId,
          campName: campInfo.campName,
          amount: campInfo.campFees,
          paymentIntentId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types[0], // usually "card"
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
        Pay for {campInfo.campName}
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
