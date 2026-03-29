const AboutIntro = () => {
  return (
    <section className="py-20 px-6 md:px-16 text-center animate-fadeUp">
      <h2 className="text-4xl md:text-5xl font-bold mb-8">نشأة الشركة</h2>

      <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
        تأسست شركة رواش العقارية برؤية طموحة لتكون من الشركات الرائدة في
        المملكة، وتركّز أعمالها على مسارات رئيسية تشمل التطوير العقاري،
        المقاولات العامة، والتصميم والإشراف الهندسي.
      </p>

      {/* Services */}
      <div className="mt-12 flex flex-col md:flex-row justify-center gap-8 text-xl font-semibold">
        <span>التطوير العقاري</span>
        <span>المقاولات العامة</span>
        <span>التصميم والإشراف الهندسي</span>
      </div>
    </section>
  );
};

export default AboutIntro;
