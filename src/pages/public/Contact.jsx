import PageBanner from "../../components/common/PageBanner";
import ContactSection from "../../features/website/contact/ContactSection";

const Contact = () => {
  return (
    <div className="bg-white font-cairo">
      <PageBanner
        title="تواصل معنا"
        description="نحن هنا لمساعدتك، تواصل معنا لأي استفسار أو استشارة عقارية"
        image="images/bannar-4.png"
      />

      <ContactSection />
    </div>
  );
};

export default Contact;
