import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Login from "./pages/Login";
import RegisterOrganization from "./pages/RegisterOrganization";
import RegisterMember from "./pages/RegisterMember";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import MemberDashboard from "./pages/MemberDashboard";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "superadmin") {
      return <Navigate to="/dashboard/superadmin" replace />;
    } else if (user.role === "organization") {
      return <Navigate to="/dashboard/organization" replace />;
    } else if (user.role === "member") {
      return <Navigate to="/dashboard/organization" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/register/organization"
              element={<RegisterOrganization />}
            />
            <Route path="/register/member" element={<RegisterMember />} />
            <Route
              path="/dashboard/superadmin"
              element={
                <RoleBasedRoute allowedRoles={["superadmin"]}>
                  <SuperAdminDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/dashboard/organization"
              element={
                <RoleBasedRoute allowedRoles={["organization"]}>
                  <OrganizationDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/dashboard/member"
              element={
                <RoleBasedRoute allowedRoles={["member"]}>
                  <MemberDashboard />
                </RoleBasedRoute>
              }
            />
            <Route path="/" element={<HomeRedirect />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
