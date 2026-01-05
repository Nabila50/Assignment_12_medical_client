import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useUserRole from "../../hooks/useUserRole";

const Navbar = () => {
   const { role, roleLoading } = useUserRole();
  console.log(role);
  const { user, logOut, signIn } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then((result) => {
        Swal.fire({
          title: "Logged Out!",
          text: "LogOut Successfully",
          icon: "success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const navItems = (
    <>
      <li className="link-hover text-[#00bcd5] font-bold text-base">
        <NavLink to="/">Home</NavLink>
      </li>
      <li className="link-hover text-[#00bcd5] font-bold text-base">
        <NavLink to="availableCamps">Available Camps</NavLink>
      </li>
      <li className="link-hover text-[#00bcd5] font-bold text-base">
        <NavLink to="beAParticipant">Join Us </NavLink>
      </li>
     
     {
      user &&(
        <>
        {!roleLoading && role ==='organizer' &&  (
        <>
          <li className="link-hover text-[#00bcd5] font-bold text-base">
            <NavLink to="/orgDashboard/organizer-profile">Organizer Dashboard </NavLink>
          </li>   
           
        </>
      )}

        <li className="link-hover text-[#00bcd5] font-bold text-base">
        <NavLink to="/partiDashboard/analytics">Participant Dashboard </NavLink>
      </li> 
        </>
        
        
      )
     }

      
    </>
  );

  return (
    <div className="navbar bg-[#f6f6f6] p-3">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">
          <img className="w-20 h-15" src="medical-logo.png" alt="" />
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end gap-2">
        {user ? (
          <>
            {" "}
            <p className="text-sm">{user?.displayName}</p>  
            <div className="relative inline-block">
              {/* Image */}
              <img
                className="w-10 h-10 rounded-full"
                src={user?.photoURL}
                alt=""
              />

              {/* User Name (hidden by default, shown on hover) */}
              <span className="absolute left-[-120%] top-0 w-max text-center bg-color bg-opacity-70 text-black rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-200 px-2 py-1">
              
                {user?.email}
              </span>
            </div>
            
            <button
              onClick={handleLogOut}
              className="btn bg-[#00bcd5] text-white"
            >
              LogOut
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn bg-[#00bcd5] text-white">
              Login
            </Link>
            <Link to="/register" className="btn bg-[#00bcd5] text-white">
              Register{" "}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
