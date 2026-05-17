import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./features/dashboard/pages/Dashborad";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import UserManagement from "./features/users/pages/UserManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceManagement from "./features/serviceRequest/pages/ServiceManagement";
import PrivateRoute from "./utils/PrivateRoute";
import Request from "./features/requests/pages/Request";
import CategoryManagemnt from "./features/categories/pages/CategoryManagemnt";
import UserProfile from "./features/users/components/UserProfile";
import { NotificationProvider } from "./context/NotificationContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
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
              <PrivateRoute allowdRoles={["Admin"]}>
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
          <Route
            path="categories"
            element={
              <PrivateRoute allowdRoles={["Admin"]}>
                <CategoryManagemnt />
              </PrivateRoute>
            }
          />
          <Route
            path="userProfile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
