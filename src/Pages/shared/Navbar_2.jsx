import { Link } from "react-router";
import { useState } from "react";

const Navbar = () => {
  // Example auth state — replace with your real auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const user = {
    name: "John Doe",
    photo: "https://i.pravatar.cc/100",
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // replace with real logout logic
    setIsLoggedIn(false);
  };

  return (
    <div className="navbar bg-base-100 shadow">
      {/* Left - Logo + Website name */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          YourWebsite
        </Link>
      </div>

      {/* Center - Nav links */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/camps">Available Camps</Link></li>
        </ul>
      </div>

      {/* Right - Auth section */}
      <div className="flex-none">
        {/* When NOT logged in */}
        {!isLoggedIn && (
          <Link to="/join" className="btn btn-primary">Join Us</Link>
        )}

        {/* When logged in */}
        {isLoggedIn && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photo} alt="profile" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <span>{user.name}</span>
              </li>

              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
