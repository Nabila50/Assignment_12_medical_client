// ---------------- Forbidden.jsx ----------------
import { Link } from "react-router";
import { FaBan, FaHome } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaBan className="text-red-500 text-6xl" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          403 Forbidden
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Sorry, you don’t have permission to access this page.
          <br />
          Please contact the administrator or return to a safe page.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="btn bg-[#00bcd5] text-white flex items-center justify-center gap-2"
          >
            <FaHome /> Go to Home
          </Link>

          <Link
            to="/login"
            className="btn btn-outline border-[#00bcd5] text-[#00bcd5]"
          >
            Login with Another Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
