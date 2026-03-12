import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashborad";
import Request from "./pages/Request";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import UserManagement from "./pages/UserManagement";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="request" element={<Request />} />
        <Route path="login" element={<Login />} />
        <Route path="userManagement" element={<UserManagement />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
