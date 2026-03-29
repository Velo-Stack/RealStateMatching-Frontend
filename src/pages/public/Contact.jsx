import PublicNavbar from "../../components/navigation/PublicNavbar";
import PageBanner from "../../components/common/PageBanner";

import ContactSection from "../../features/website/contact/ContactSection";
import Footer from "../../features/website/home/sections/Footer";

const Contact = () => {
  return (
    <div className="bg-white font-cairo">
      <PublicNavbar />

      <PageBanner
        title="تواصل معنا"
        description="نحن هنا لمساعدتك، تواصل معنا لأي استفسار أو استشارة عقارية"
        image="images/bannar-4.png"
      />

      <ContactSection />

      <Footer />
    </div>
  );
};

export default Contact;
