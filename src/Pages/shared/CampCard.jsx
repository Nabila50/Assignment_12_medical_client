import { Link } from "react-router";

const CampCard = ({ camp }) => {
  const {
    _id,
    campName,
    image,
    dateTime,
    location,
    healthcareProfessional,
    participantCount,
    description,
  } = camp;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img
          src={image}
          alt={campName}
          className="h-48 w-full object-cover"
        />
      </figure>

      <div className="card-body space-y-2">
        <h2 className="card-title text-[#00bcd5] text-xl">{campName}</h2>

        <p>
          <strong>Date & Time:</strong> {dateTime}
        </p>

        <p>
          <strong>Location:</strong> {location}
        </p>

        <p>
          <strong>Healthcare Professional:</strong> {healthcareProfessional}
        </p>

        <p>
          <strong>Participants:</strong> {participantCount || 0}
        </p>

        <p className="text-gray-600">{description?.slice(0, 100)}...</p>

        <div className="card-actions justify-end">
          <Link
            to={`/camp-details/${_id}`}
            className="btn bg-[#00bcd5] text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampCard;
