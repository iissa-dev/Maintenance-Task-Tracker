import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashborad";
import Request from "./pages/Request";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import UserManagement from "./pages/UserManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceManagement from "./pages/ServiceManagement";
import PrivateRoute from "./utils/PrivateRoute";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="request"
            element={
              <PrivateRoute>
                <Request />
              </PrivateRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route
            path="userManagement"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="serviceManagement"
            element={
              <PrivateRoute>
                <ServiceManagement />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
