// import { Route, Routes } from "react-router-dom";
import "./App.css";
// import SignIn from "./components/login/Login";
import ButtonAppBar from "./shared/elementLib/AppBar";
import { useDispatch, useSelector } from "react-redux";
// import Dashboard from "./components/dashboard/Dashboard";
// import DraftGenerator from "./components/draftGenerator/DraftGenerator";
// import Finaldraft from "./components/finalDraft/FinalDraft";
import RouteHandler from "./components/Routes";
import Spinner from "./components/Spinner/Spinner";

function App() {
  const { email, isLoggedIn } = useSelector((state) => state.login);
  const { show } = useSelector((state) => state.spinner);
  return (
    <div className="App">
      {show && <Spinner overlay="true" open="true" />}
      {email && email.length > 0 && isLoggedIn && <ButtonAppBar />}
      {/* <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/draftGenerator" element={<DraftGenerator />}></Route>
        <Route path="/finaldraft" element={<Finaldraft />}></Route>
      </Routes> */}
      <RouteHandler />
    </div>
  );
}

export default App;
