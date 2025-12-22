import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import RegistrationModal from "../Pages/ParticipantRegister";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import AddCamp from "../Pages/AddCamp";
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
import ActiveParticipant from "../Pages/Part-DashboardPages/ActiveParticipant";
import ParticipantProfile from "../Pages/Part-DashboardPages/ParticipantProfile";
import MakeOrganizer from "../Pages/Org-DashboardPages/MakeOrganizer";
import PrivateRoute from "../Routes/PrivateRoute";
import Forbidden from "../Pages/Forbidden";
import OrganizerRoute from "../Routes/OrganizerRoute";
import ManageRegisteredCamps from "../Pages/Org-DashboardPages/ManageRegisteredCamps";
import Payment from "../Pages/Org-DashboardPages/Payment";
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
        element: <CampDetails />,
      },
      {
        path: "participantRegistration",
        Component: ParticipantRegistration,
      },
      {
        path: 'forbidden',
        Component: Forbidden
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
        element: <OrganizerRoute><UpdateCamp></UpdateCamp></OrganizerRoute>,
      },
      {
        path: "organizer-profile",
        Component: OrganizerProfile,
      },
      {
        path: "make-organizer",
        element: <OrganizerRoute><MakeOrganizer></MakeOrganizer></OrganizerRoute>
      },
      {
        path: 'manageRegisteredCamps',
        Component: ManageRegisteredCamps
      },
      {
        path: 'payment/:id',
        Component: Payment
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
        Component: Analytics,
      },
      {
        path: "participantProfile",
        Component: ParticipantProfile,
      },
      {
        path: "registeredCamps",
        Component: RegisteredCamps,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "pendingParticipants",
        element: <OrganizerRoute><PendingParticipants></PendingParticipants></OrganizerRoute>
      },
      {
        path: "activeParticipant",
        element: <OrganizerRoute><ActiveParticipant></ActiveParticipant></OrganizerRoute>
      },
    ],
  },
]);
