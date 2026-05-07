import "./App.css";
import {Routes, Route} from "react-router-dom";
import Dashboard from "./features/dashboard/pages/Dashborad";
import Login from "./pages/Login";
import {AuthProvider} from "./context/AuthContext";
import UserManagement from "./features/users/pages/UserManagement";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ServiceManagement from "./features/serviceRequest/pages/ServiceManagement";
import PrivateRoute from "./utils/PrivateRoute";
import Request from "./features/requests/pages/Request";

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
                                <Dashboard/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="request"
                        element={
                            <PrivateRoute>
                                <Request/>
                            </PrivateRoute>
                        }
                    />
                    <Route path="login" element={<Login/>}/>
                    <Route
                        path="userManagement"
                        element={
                            <PrivateRoute>
                                <UserManagement/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="serviceManagement"
                        element={
                            <PrivateRoute>
                                <ServiceManagement/>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
