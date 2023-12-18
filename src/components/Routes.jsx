import React from "react";
import {
  Link,
  Route,
  Routes,
  Switch,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignIn from "./login/Login";
import { useSelector } from "react-redux";
import Dashboard from "./dashboard/Dashboard";
import DraftGenerator from "./draftGenerator/DraftGenerator";
import Finaldraft from "./finalDraft/FinalDraft";
import Rephraser from "./rephraser/Rephraser";
import FinalRephraser from "./finalRephraser/FinalRephraser";
const PrivateRoute = ({ Component }) => {
  const location = useLocation();
  const { email, isLoggedIn } = useSelector((state) => state.login);

  return email && email.length > 0 && isLoggedIn ? (
    <Component />
  ) : (
    <Navigate
      to={{
        pathname: "/",
        state: { from: location },
      }}
    />
  );
};

function RouteHandler() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />}></Route>
      <Route
        path="/dashboard"
        element={<PrivateRoute Component={Dashboard} />}
      ></Route>
      <Route
        path="/draftGenerator"
        element={<PrivateRoute Component={DraftGenerator} />}
      ></Route>
      <Route
        path="/rephraser"
        element={<PrivateRoute Component={Rephraser} />}
      ></Route>
      <Route
        path="/finalrephraser"
        element={<PrivateRoute Component={FinalRephraser} />}
      ></Route>
      <Route
        path="/finaldraft"
        element={<PrivateRoute Component={Finaldraft} />}
      ></Route>
    </Routes>
  );
}
export default RouteHandler;
