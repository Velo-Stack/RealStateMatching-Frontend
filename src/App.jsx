import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { hasRole, ROLES } from "./utils/rbac";
import Login from "./pages/auth/Login";
import Home from "./pages/public/Home";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";
import Offers from "./pages/app/Offers";
import Requests from "./pages/app/Requests";
import Matches from "./pages/app/Matches";
import Dashboard from "./pages/app/Dashboard";
import Notifications from "./pages/app/Notifications";
import Users from "./pages/app/Users";
import AuditLogs from "./pages/app/AuditLogs";
import Reports from "./pages/app/Reports";
import Teams from "./pages/app/Teams";
import Chat from "./pages/app/Chat";
import NotAuthorized from "./pages/system/NotAuthorized";
import NotFound from "./pages/system/NotFound";
import { SubmissionPage } from "./features/submission";

// Protected Route Wrapper (auth only)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-400 text-sm">
        جار التحميل...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return children;
};

// Role-based guard for individual pages
const RoleGuard = ({
  allowedRoles,
  children,
  redirectTo = "/not-authorized",
}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!hasRole(user, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router basename="/dev">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/submit" element={<SubmissionPage />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <RoleGuard
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                >
                  <Dashboard />
                </RoleGuard>
              }
            />
            <Route
              path="offers"
              element={
                <RoleGuard
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
                  ]}
                >
                  <Offers />
                </RoleGuard>
              }
            />
            <Route
              path="requests"
              element={
                <RoleGuard
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
                  ]}
                >
                  <Requests />
                </RoleGuard>
              }
            />
            <Route
              path="matches"
              element={
                <RoleGuard
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <Matches />
                </RoleGuard>
              }
            />
            <Route
              path="notifications"
              element={
                <RoleGuard
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.BROKER,
                    ROLES.EMPLOYEE,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                >
                  <Notifications />
                </RoleGuard>
              }
            />
            <Route
              path="users"
              element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                  <Users />
                </RoleGuard>
              }
            />
            <Route
              path="audit-logs"
              element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                  <AuditLogs />
                </RoleGuard>
              }
            />
            <Route
              path="reports"
              element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                  <Reports />
                </RoleGuard>
              }
            />
            <Route
              path="teams"
              element={
                <RoleGuard
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.BROKER,
                    ROLES.EMPLOYEE,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                >
                  <Teams />
                </RoleGuard>
              }
            />
            <Route
              path="chat"
              element={
                <RoleGuard
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                  redirectTo="/app"
                >
                  <Chat />
                </RoleGuard>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
