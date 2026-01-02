import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import Logo from "../Pages/Home/Logo";
import Footer from "../Pages/shared/Footer";
import useUserRole from "../hooks/useUserRole";

const PartiDashboardLayout = () => {
   const { role, roleLoading } = useUserRole();
  console.log(role);
  return (
    <div className="drawer lg:drawer-open ">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full  lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
        </div>
        <div className="mx-2 flex-1 px-2 lg:hidden">Participant DashBoard</div>

        {/* Page content here */}
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-color min-h-full w-60 p-4 font-bold hover:bg-[#00bcd5] text-[#516668]">
          {/* Sidebar content here */}
          <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <Logo></Logo>
          </li>
          <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/analytics">Analytics</NavLink>
          </li>
          <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/participantProfile">
              Participant Profile
            </NavLink>
          </li>
          <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/registeredCamps">
              Registered Camps
            </NavLink>
          </li>
          
           <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/participantPayment">
              Participant Payment
            </NavLink>
          </li>
          <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/userPaymentHistory">
              Participant Payment History
            </NavLink>
          </li>
           { !roleLoading && role ==='organizer' &&
           <>
           <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/activeParticipant">
              Active Participants
            </NavLink>
          </li>

          <li className="my-1 hover:bg-[#07daf676] hover:text-white">
            <NavLink to="/partiDashboard/pendingParticipants">
              Pending Participants
            </NavLink>
          </li>
         
           </>
           }
          
        </ul>
      </div>
     
    </div>
    
  );
};

export default PartiDashboardLayout;
