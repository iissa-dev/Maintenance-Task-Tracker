import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashborad";
import Request from "./pages/Request";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import UserManagement from "./pages/UserManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceManagement from "./pages/ServiceManagement";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="request" element={<Request />} />
          <Route path="login" element={<Login />} />
          <Route path="userManagement" element={<UserManagement />} />
          <Route path="serviceManagement" element={<ServiceManagement />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
