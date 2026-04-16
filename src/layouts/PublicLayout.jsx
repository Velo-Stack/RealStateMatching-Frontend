import { Outlet } from "react-router-dom";
import PublicFooter from "../components/navigation/PublicFooter";
import PublicNavbar from "../components/navigation/PublicNavbar";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { useEffect } from "react";

const PublicLayout = () => {
  // Remove theme attribute for public pages to prevent dark/light mode
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    
    // Cleanup: restore theme when leaving public pages
    return () => {
      const storedTheme = localStorage.getItem('theme');
      const theme = storedTheme === 'light' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <PublicNavbar />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <PublicFooter />
      <ScrollToTopButton />
    </div>
  );
};

export default PublicLayout;
