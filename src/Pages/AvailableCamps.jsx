// ---------------- AvailableCamps.jsx ----------------
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
// import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";

const AvailableCamps = () => {
  const {user} = useAuth();
  const axiosInstance = useAxios();

  // ---------------- UI States ----------------
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [threeColumn, setThreeColumn] = useState(true);

  // ---------------- Fetch All Camps ----------------
  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["availableCamps"],
    queryFn: async () => {
      const res = await axiosInstance.get("/addCamps/all");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  // ---------------- FILTER + SORT ----------------
  const filteredCamps = useMemo(() => {
    let result = [...camps];

    // SEARCH
    if (searchText.trim()) {
      const t = searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.campName.toLowerCase().includes(t) ||
          c.location?.toLowerCase().includes(t) ||
          c.healthcareProfessional?.toLowerCase().includes(t)
      );
    }

    // SORT OPTIONS
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

  // ---------------- UI JSX ----------------
  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">

      {/* ---------- Top Controls ---------- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by name, location, or professional..."
          className="input input-bordered w-full md:w-1/3"
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Sort Dropdown */}
        <select
          className="select select-bordered"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="most-registered">Most Registered</option>
          <option value="fees">Camp Fees</option>
          <option value="alphabetical">A → Z (Camp Name)</option>
        </select>

        {/* Layout Button */}
        <button
          className="btn bg-[#00bcd5] text-white"
          onClick={() => setThreeColumn(!threeColumn)}
        >
          {threeColumn ? "Switch to 2 Columns" : "Switch to 3 Columns"}
        </button>
      </div>

      {/* ---------- Camps Grid ---------- */}
      <div
        className={`grid gap-6 ${
          threeColumn ? "md:grid-cols-3" : "md:grid-cols-2"
        } grid-cols-1`}
      >
        {filteredCamps.map((camp) => (
          <div
            key={camp._id}
            className="card bg-base-200 shadow-xl p-4"
          >
            <figure>
              <img
                src={camp.image || '/placeholder.jpg'}
                alt={camp.campName}
                className="h-48 w-full object-cover rounded-lg"
              />
            </figure>

            <div className="card-body">
              <h2 className="text-2xl font-bold">{camp.campName}</h2>

              <p><strong>Date & Time:</strong> {camp.dateTime}</p>
              <p><strong>Location:</strong> {camp.location}</p>
              <p>
                <strong>Healthcare Professional:</strong>{" "}
                {camp.healthcareProfessional}
              </p>
              {/* <p><strong>Participants:</strong> {camp.participantCount || 0}</p> */}
              <p className="text-sm mt-2">
                {camp.description?.slice(0, 80)}...
              </p>

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
