import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login.jsx";
import NotFound from "./NotFound.jsx";
import SignUp from "./SignUp.jsx";
import MarkAttendanceFace from "./MarkAttendanceFace.jsx";
import WebcamAttendance from "./WebcamAttendance.jsx";
import Profile from "./Profile.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "login", element: <Login /> },
  { path: "*", element: <NotFound /> },
  { path: "SignUp", element: <SignUp /> },
  { path: "mark", element: <MarkAttendanceFace /> },
  { path: "cam", element: <WebcamAttendance /> },
  { path: "profile", element: <Profile /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
