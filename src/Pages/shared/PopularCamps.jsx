import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PopularCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const axiosSecure = useAxiosSecure();

  useEffect(() => {
    // Fetch top 6 most popular camps
    fetch("http://localhost:5000/addCamps/all")
      .then(res => res.json())
      .then(data => setCamps(data))
      .catch(err => console.error(err));
  }, []);

 
  return (
    <div className="py-16 bg-base-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10  text-[#00bcd5] ">
          Popular Medical Camps
        </h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {camps.slice(0, 6).map((camp) => (
            <div
              key={camp._id}
              className="card bg-sky-50 shadow-xl hover:shadow-2xl transition"
            >
              <figure>
                <img
                  src={camp.image}
                  alt={camp.name}
                  className="w-full h-48 object-cover "
                />
              </figure>

              <div className="card-body">
                <h3 className="card-title text-[#00bcd5] font-bold">
                  {camp.campName}
                </h3>

                <p>
                  <strong>Fees:</strong> ${camp.campFees}
                </p>
                <p>
                  <strong>Date:</strong> {camp.dateTime}
                </p>

                <p>
                  <strong>Location:</strong> {camp.location}
                </p>
                <p>
                  <strong>Healthcare Professional:</strong>{" "}
                  {camp.healthcareProfessional}
                </p>
                <p className="font-semibold">
                  Participants: {camp.participantCount}
                </p>

                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/camp-details/${camp._id}`}
                    className="btn bg-[#00bcd5] text-white font-extrabold mt-4"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/availableCamps" className="btn bg-[#00bcd5] text-white w-full mt-4">
            See All Camps
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularCamps;
