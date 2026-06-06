import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { hasRole, ROLES } from "./utils/rbac";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterSuccess from "./pages/auth/RegisterSuccess";
import Home from "./pages/public/Home";
import Projects from "./pages/public/Projects";
import About from "./pages/public/About";
import Blog from "./pages/public/Blog";
import Contact from "./pages/public/Contact";
import ProjectDetails from "./pages/public/ProjectDetails";
import InvestorRelations from "./pages/public/InvestorRelations";
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
import WebsiteCms from "./pages/app/WebsiteCms";
import SettingsFlags from "./pages/app/SettingsFlags";
import OffersMap from "./pages/app/OffersMap";
import CommissionCalculator from "./pages/app/CommissionCalculator";
import MyPoints from "./pages/app/MyPoints";
import Rewards from "./pages/app/Rewards";
import Leaderboard from "./pages/app/Leaderboard";
import Offices from "./pages/app/Offices";
import Registrations from "./pages/app/Registrations";
import NotAuthorized from "./pages/system/NotAuthorized";
import NotFound from "./pages/system/NotFound";
import NoAccess from "./pages/system/NoAccess";
import { SubmissionPage } from "./features/submission";
import { canAccessPage } from "./utils/rbac";

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
  page,
  children,
  redirectTo = "/not-authorized",
}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (Array.isArray(user.pages)) {
    if (!page || !canAccessPage(user, page)) {
      return <Navigate to={redirectTo} replace />;
    }
    return children;
  }
  if (!hasRole(user, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

const PAGE_REDIRECTS = [
  { page: "dashboard", to: "/app" },
  { page: "offers", to: "/app/offers" },
  { page: "map", to: "/app/map" },
  { page: "offers.create", to: "/app/offers" },
  { page: "requests", to: "/app/requests" },
  { page: "requests.create", to: "/app/requests" },
  { page: "matches", to: "/app/matches" },
  { page: "notifications", to: "/app/notifications" },
  { page: "users", to: "/app/users" },
  { page: "teams", to: "/app/teams" },
  { page: "conversations", to: "/app/chat" },
  { page: "reports", to: "/app/reports" },
  { page: "auditLogs", to: "/app/audit-logs" },
  { page: "websiteAdmin", to: "/app/website" },
  { page: "settingsAdmin", to: "/app/settings/flags" },
  { page: "commissionCalculator", to: "/app/tools/commission" },
  { page: "myPoints", to: "/app/my-points" },
  { page: "rewards", to: "/app/rewards" },
  { page: "leaderboard", to: "/app/leaderboard" },
  { page: "offices", to: "/app/offices" },
  { page: "registrations", to: "/app/registrations" },
];

const AppIndex = () => {
  const { user } = useAuth();
  if (Array.isArray(user?.pages) && !user.pages.includes("dashboard")) {
    const firstAllowed = PAGE_REDIRECTS.find((item) => user.pages.includes(item.page));
    return <Navigate to={firstAllowed?.to || "/app/no-access"} replace />;
  }
  return (
    <RoleGuard
      page="dashboard"
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
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/investors" element={<InvestorRelations />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/success" element={<RegisterSuccess />} />
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
              element={<AppIndex />}
            />
            <Route path="no-access" element={<NoAccess />} />
            <Route
              path="offers"
              element={
                <RoleGuard
                  page="offers"
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                >
                  <Offers />
                </RoleGuard>
              }
            />
            <Route
              path="map"
              element={
                <RoleGuard
                  page="map"
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
                  ]}
                >
                  <OffersMap />
                </RoleGuard>
              }
            />
            <Route
              path="requests"
              element={
                <RoleGuard
                  page="requests"
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
                    ROLES.DATA_ENTRY_ONLY,
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
                  page="matches"
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
                  page="notifications"
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
                <RoleGuard page="users" allowedRoles={[ROLES.ADMIN]}>
                  <Users />
                </RoleGuard>
              }
            />
            <Route
              path="audit-logs"
              element={
                <RoleGuard page="auditLogs" allowedRoles={[ROLES.ADMIN]}>
                  <AuditLogs />
                </RoleGuard>
              }
            />
            <Route
              path="reports"
              element={
                <RoleGuard page="reports" allowedRoles={[ROLES.ADMIN]}>
                  <Reports />
                </RoleGuard>
              }
            />
            <Route
              path="teams"
              element={
                <RoleGuard
                  page="teams"
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                >
                  <Teams />
                </RoleGuard>
              }
            />
            <Route
              path="website"
              element={
                <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                  <WebsiteCms />
                </RoleGuard>
              }
            />
            <Route
              path="settings/flags"
              element={
                <RoleGuard page="settingsAdmin" allowedRoles={[ROLES.ADMIN]}>
                  <SettingsFlags />
                </RoleGuard>
              }
            />
            <Route
              path="tools/commission"
              element={
                <RoleGuard
                  page="commissionCalculator"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <CommissionCalculator />
                </RoleGuard>
              }
            />
            <Route
              path="my-points"
              element={
                <RoleGuard
                  page="myPoints"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <MyPoints />
                </RoleGuard>
              }
            />
            <Route
              path="rewards"
              element={
                <RoleGuard
                  page="rewards"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <Rewards />
                </RoleGuard>
              }
            />
            <Route
              path="leaderboard"
              element={
                <RoleGuard
                  page="leaderboard"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <Leaderboard />
                </RoleGuard>
              }
            />
            <Route
              path="offices"
              element={
                <RoleGuard
                  page="offices"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}
                >
                  <Offices />
                </RoleGuard>
              }
            />
            <Route
              path="registrations"
              element={
                <RoleGuard page="registrations" allowedRoles={[ROLES.ADMIN]}>
                  <Registrations />
                </RoleGuard>
              }
            />
            <Route
              path="chat"
              element={
                <RoleGuard
                  page="conversations"
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.EMPLOYEE,
                    ROLES.BROKER,
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
