import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import SplashScreen from "./components/common/SplashScreen";
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
import JoinUs from "./pages/public/JoinUs";
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
import SettingsFlags from "./pages/app/SettingsFlags";
import OffersMap from "./pages/app/OffersMap";
import CommissionCalculator from "./pages/app/CommissionCalculator";
import MyPoints from "./pages/app/MyPoints";
import Rewards from "./pages/app/Rewards";
import Leaderboard from "./pages/app/Leaderboard";
import Offices from "./pages/app/Offices";
import Registrations from "./pages/app/Registrations";
import JoinApplications from "./pages/app/JoinApplications";
import Search from "./pages/app/Search";
import Subscription from "./pages/app/Subscription";
import Profile from "./pages/app/Profile";
import Pricing from "./pages/public/Pricing";
import NotAuthorized from "./pages/system/NotAuthorized";
import NotFound from "./pages/system/NotFound";
import NoAccess from "./pages/system/NoAccess";
import { SubmissionPage } from "./features/submission";
import { canAccessPage } from "./utils/rbac";
import { APP_ROUTES, LEGACY_APP_REDIRECTS, PAGE_REDIRECTS } from "./utils/appRoutes";

const WebsiteDashboard = lazy(() => import("./features/website-cms/pages/WebsiteDashboardPage"));
const WebsiteSettingsPage = lazy(() => import("./features/website-cms/pages/WebsiteSettingsPage"));
const WebsiteHomePage = lazy(() => import("./features/website-cms/pages/WebsiteHomePage"));
const ProjectsListPage = lazy(() => import("./features/website-cms/pages/ProjectsListPage"));
const ProjectEditorPage = lazy(() => import("./features/website-cms/pages/ProjectEditorPage"));
const WebsiteInvestorsPage = lazy(() => import("./features/website-cms/pages/WebsiteInvestorsPage"));

const LandComparables = lazy(() => import("./pages/app/LandComparables"));
const FeasibilityTool = lazy(() => import("./pages/app/FeasibilityTool"));

const LazyPageFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-slate-400 text-sm">
    جاري تحميل الصفحة...
  </div>
);

const LazyPage = ({ children }) => (
  <Suspense fallback={<LazyPageFallback />}>{children}</Suspense>
);

// Protected Route Wrapper (auth only)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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

const OfficesAccessGuard = ({ children, redirectTo = "/not-authorized" }) => {
  const { user, profile } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER) {
    return children;
  }

  const hasOfficeMembership =
    Array.isArray(profile?.offices) && profile.offices.length > 0;

  if (hasOfficeMembership) {
    return children;
  }

  return <Navigate to={redirectTo} replace />;
};

const AppIndex = () => {
  const { user } = useAuth();
  if (Array.isArray(user?.pages) && !user.pages.includes("dashboard")) {
    const firstAllowed = PAGE_REDIRECTS.find((item) => user.pages.includes(item.page));
    return <Navigate to={firstAllowed?.to || APP_ROUTES.noAccess} replace />;
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
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/investors" element={<InvestorRelations />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
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
            <Route path="website">
              <Route
                index
                element={
                  <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                    <LazyPage><WebsiteDashboard /></LazyPage>
                  </RoleGuard>
                }
              />
              <Route
                path="projects"
                element={
                  <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                    <LazyPage><ProjectsListPage /></LazyPage>
                  </RoleGuard>
                }
              />
              <Route
                path="projects/:id"
                element={
                  <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                    <LazyPage><ProjectEditorPage /></LazyPage>
                  </RoleGuard>
                }
              />
              <Route
                path="settings"
                element={
                  <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                    <LazyPage><WebsiteSettingsPage /></LazyPage>
                  </RoleGuard>
                }
              />
              <Route
                path="home"
                element={
                  <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                    <LazyPage><WebsiteHomePage /></LazyPage>
                  </RoleGuard>
                }
              />
              <Route
                path="investors"
                element={
                  <RoleGuard page="websiteAdmin" allowedRoles={[ROLES.ADMIN]}>
                    <LazyPage><WebsiteInvestorsPage /></LazyPage>
                  </RoleGuard>
                }
              />
            </Route>
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
              path="tools/feasibility"
              element={
                <RoleGuard
                  page="feasibilityTool"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <LazyPage>
                    <FeasibilityTool />
                  </LazyPage>
                </RoleGuard>
              }
            />
            <Route
              path="lands/comparables"
              element={
                <RoleGuard
                  page="landComparables"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}
                >
                  <LazyPage>
                    <LandComparables />
                  </LazyPage>
                </RoleGuard>
              }
            />
            <Route
              path="search"
              element={
                <RoleGuard
                  page="search"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER, ROLES.EMPLOYEE]}
                >
                  <Search />
                </RoleGuard>
              }
            />
            <Route
              path="subscription"
              element={
                <RoleGuard
                  page="subscriptions"
                  allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.BROKER]}
                >
                  <Subscription />
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
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.MANAGER,
                    ROLES.BROKER,
                    ROLES.EMPLOYEE,
                    ROLES.DATA_ENTRY_ONLY,
                  ]}
                >
                  <OfficesAccessGuard>
                    <Offices />
                  </OfficesAccessGuard>
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
              path="join-applications"
              element={
                <RoleGuard page="joinApplications" allowedRoles={[ROLES.ADMIN]}>
                  <JoinApplications />
                </RoleGuard>
              }
            />
            <Route path="profile" element={<Profile />} />
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

          {LEGACY_APP_REDIRECTS.map(({ from, to }) => (
            <Route
              key={from}
              path={from}
              element={<Navigate to={to} replace />}
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
