import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PublicNavbar from '../../components/navigation/PublicNavbar';
import Footer from '../../features/website/home/sections/Footer';
import FadeInSection from '../../components/common/FadeInSection';
import JoinUsHero from '../../features/join-us/components/JoinUsHero';
import JoinUsWizard from '../../features/join-us/components/JoinUsWizard';
import { fetchJoinUsStatus } from '../../features/join-us/services/joinUsApi';
import { JOIN_US_COLORS } from '../../features/join-us/constants/joinUsConstants';
import { joinUsCardClass } from '../../features/join-us/components/ui/joinUsTheme';

const JoinUs = () => {
  const [enabled, setEnabled] = useState(null);

  useEffect(() => {
    fetchJoinUsStatus()
      .then((data) => setEnabled(Boolean(data?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  if (enabled === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo text-gray-500"
        style={{ backgroundColor: JOIN_US_COLORS.pageBg }}
      >
        جاري التحميل...
      </div>
    );
  }

  if (!enabled) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="font-cairo min-h-screen" style={{ backgroundColor: JOIN_US_COLORS.pageBg }}>
      <PublicNavbar />
      <JoinUsHero />
      <section className="px-4 sm:px-6 md:px-16 pb-14 md:pb-20 -mt-10 md:-mt-14 relative z-10">
        <FadeInSection direction="up">
          <div className={joinUsCardClass}>
            <JoinUsWizard />
          </div>
        </FadeInSection>
      </section>
      <Footer />
    </div>
  );
};

export default JoinUs;
