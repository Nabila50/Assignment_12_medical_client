import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { Link } from "react-router";

const AvailableCamps = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [threeColumn, setThreeColumn] = useState(true);

  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["availableCamps"],
    queryFn: async () => {
      const res = await axiosInstance.get("/addCamps/all");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  const filteredCamps = useMemo(() => {
    let result = [...camps];

    if (searchText.trim()) {
      const t = searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.campName?.toLowerCase().includes(t) ||
          c.location?.toLowerCase().includes(t) ||
          c.healthcareProfessional?.toLowerCase().includes(t)
      );
    }

    if (sortOption === "most-registered") {
      result.sort(
        (a, b) => (b.participantCount || 0) - (a.participantCount || 0)
      );
    }

    if (sortOption === "fees") {
      result.sort(
        (a, b) => Number(a.campFees || 0) - Number(b.campFees || 0)
      );
    }

    if (sortOption === "alphabetical") {
      result.sort((a, b) => a.campName.localeCompare(b.campName));
    }

    return result;
  }, [searchText, sortOption, camps]);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="grid gap-6 md:grid-cols-3 grid-cols-1">
        {filteredCamps.map((camp) => (
          <div key={camp._id} className="card bg-base-200 shadow-xl p-4">
            <img
              src={camp.image || "/placeholder.jpg"}
              alt={camp.campName}
              className="h-48 w-full object-cover rounded-lg"
            />

            <div className="card-body">
              <h2 className="text-2xl font-bold">{camp.campName}</h2>
              <p><strong>Date:</strong> {camp.dateTime}</p>
              <p><strong>Location:</strong> {camp.location}</p>

              <Link to={`/camp-details/${camp._id}`}>
                <button className="btn bg-[#00bcd5] text-white w-full mt-4">
                  Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCamps;
