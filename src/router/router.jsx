import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import RegistrationModal from "../Pages/ParticipantRegister";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import AddCamp from "../Pages/AddCamp";
import PrivateRoute from "../assets/Routes/PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import ManageCamps from "../Pages/Org-DashboardPages/ManageCamps";
import UpdateCamp from "../Pages/Org-DashboardPages/UpdateCamps";
import AvailableCamp from "../Pages/AvailableCamps";
import AvailableCamps from "../Pages/AvailableCamps";
import CampDetails from "../Pages/shared/CampDetails";
import OrganizerProfile from "../Pages/Org-DashboardPages/OrganizerProfile";
import PartiDashboardLayout from "../Layouts/PartiDashboardLayout";
import BeAParticipant from "../Pages/BeAParticipant";
import Analytics from "../Pages/Part-DashboardPages/Analytics";
import RegisteredCamps from "../Pages/Part-DashboardPages/RegisteredCamps";
import PaymentHistory from "../Pages/Part-DashboardPages/PaymentHistory";
import ParticipantRegistration from "../Pages/ParticipantRegister";
import PendingParticipants from "../Pages/Part-DashboardPages/PendingParticipants";
// import Home from "../Pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "participant-register",
        Component: RegistrationModal,
      },
      {
        path: "availableCamps",
        Component: AvailableCamps,
      },
      {
        path: "beAParticipant",
        Component: BeAParticipant,
      },
      {
        path: "/camp-details/:id",
        element: <CampDetails /> 
      },
      {
        path: "participantRegistration",
        Component: ParticipantRegistration
      }
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/orgDashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "manageCamps",
        Component: ManageCamps,
      },
      {
        path: "addCamp",
        Component: AddCamp,
      },
      {
        path: "/orgDashboard/update-camp/:campId",
        element: <UpdateCamp></UpdateCamp>,
      },
      {
        path:'organizer-profile',
        Component: OrganizerProfile
      }
    ],
  },
    {
    path: "/partiDashboard",
    element: (
      <PrivateRoute>
        <PartiDashboardLayout></PartiDashboardLayout>
      </PrivateRoute>
    ),
    children: [
       {
        path: "analytics",
        Component: Analytics
      },
      
      {
        path: "registeredCamps",
        Component: RegisteredCamps
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory
      },
      {
        path:'pendingParticipants',
        Component: PendingParticipants
      }
     
      
    ],
  },
]);
