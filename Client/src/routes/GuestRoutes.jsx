import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/header";
import HomePage from "../pages/Home";
import loginPage from "../pages/loginPage";
import registerPage from "../pages/registerPage";
import Howtouse from './page/Howtouse'
import Moving from './page/Moving'
import Repair from './page/Repair'
import Repost from './page/Repost'
export default function GuestRoutes() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export const guestRoutes = [
  { index: true, element: <HomePage /> },
  { path: "login", element: <loginPage /> },
  { path: "register", element: <registerPage /> },
  { path: "Howtouse", element: <Howtouse /> },
  { path: "Moving", element: <Moving /> },
  { path: "Repair", element: <Repair /> },
  { path: "Repost", element: <Repost /> },
  { path: "*", element: <Navigate to="/RMUTI/login" replace /> },
];