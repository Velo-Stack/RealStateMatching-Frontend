import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PublicNavbar from '../../components/navigation/PublicNavbar';
import Footer from '../../features/website/home/sections/Footer';
import JoinUsHero from '../../features/join-us/components/JoinUsHero';
import JoinUsWizard from '../../features/join-us/components/JoinUsWizard';
import { fetchJoinUsStatus } from '../../features/join-us/services/joinUsApi';

const JoinUs = () => {
  const [enabled, setEnabled] = useState(null);

  useEffect(() => {
    fetchJoinUsStatus()
      .then((data) => setEnabled(Boolean(data?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  if (enabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center font-cairo text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  if (!enabled) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-white font-cairo min-h-screen">
      <PublicNavbar />
      <JoinUsHero />
      <section className="px-4 sm:px-6 md:px-16 py-10 md:py-14">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10">
          <JoinUsWizard />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default JoinUs;
