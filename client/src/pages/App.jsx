import { Routes, Route } from "react-router-dom";
import JoinScreen from "../components/JoinScreen";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<JoinScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;