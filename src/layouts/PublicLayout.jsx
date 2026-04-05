import { Outlet } from "react-router-dom";
import PublicFooter from "../components/navigation/PublicFooter";
import PublicNavbar from "../components/navigation/PublicNavbar";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

const PublicLayout = () => (
  <div className="flex min-h-screen flex-col bg-white text-slate-900">
    <PublicNavbar />
    <main className="flex-1 bg-white">
      <Outlet />
    </main>
    <PublicFooter />
    <ScrollToTopButton />
  </div>
);

export default PublicLayout;
