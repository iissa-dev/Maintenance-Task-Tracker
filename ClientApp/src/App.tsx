import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashborad";
import Request from "./pages/Request";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="request" element={<Request />} />
    </Routes>
  );
}

export default App;
