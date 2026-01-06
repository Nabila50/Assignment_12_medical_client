import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../hooks/useAxios";

const AvailableCamps = () => {
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

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // ✅ FILTER
  let filteredCamps = [...camps];

  if (searchText.trim()) {
    const t = searchText.toLowerCase();
    filteredCamps = filteredCamps.filter(
      (c) =>
        c.campName?.toLowerCase().includes(t) ||
        c.location?.toLowerCase().includes(t) ||
        c.healthcareProfessional?.toLowerCase().includes(t)
    );
  }

  // SORT
  if (sortOption === "most-registered") {
    filteredCamps.sort(
      (a, b) => (b.participantCount || 0) - (a.participantCount || 0)
    );
  }

  if (sortOption === "fees") {
    filteredCamps.sort(
      (a, b) => Number(a.campFees || 0) - Number(b.campFees || 0)
    );
  }

  if (sortOption === "alphabetical") {
    filteredCamps.sort((a, b) =>
      a.campName.localeCompare(b.campName)
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          className="input input-bordered"
          placeholder="Search camps..."
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="select select-bordered"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="most-registered">Most Registered</option>
          <option value="fees">Camp Fees</option>
          <option value="alphabetical">A → Z</option>
        </select>

        <button
          className="btn bg-[#00bcd5] text-white"
          onClick={() => setThreeColumn(!threeColumn)}
        >
          Toggle Layout
        </button>
      </div>

      {/* Camps */}
      <div
        className={`grid gap-6 ${
          threeColumn ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
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
