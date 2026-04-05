const ContactSection = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* 🗺️ MAP */}
        <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps?q=Riyadh&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>

        {/* 📩 FORM */}
        <div className="text-right">
          <h2 className="text-3xl font-bold mb-6 text-[#1f1f1f]">تواصل معنا</h2>

          <p className="text-gray-500 mb-8 leading-relaxed">
            املأ النموذج وسنقوم بالتواصل معك في أقرب وقت ممكن.
          </p>

          <form className="space-y-5">
            {/* NAME */}
            <input
              type="text"
              placeholder="الاسم"
              className="w-full px-5 py-4 !bg-[#f9fafb] !text-black border border-gray-200 rounded-xl 
              placeholder-gray-400 focus:outline-none focus:border-[#9d7857] 
              focus:ring-1 focus:ring-[#9d7857] transition"
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full px-5 py-4 !bg-[#f9fafb] !text-black border border-gray-200 rounded-xl 
              placeholder-gray-400 focus:outline-none focus:border-[#9d7857] 
              focus:ring-1 focus:ring-[#9d7857] transition"
            />

            {/* PHONE */}
            <input
              type="text"
              placeholder="رقم الهاتف"
              className="w-full px-5 py-4 !bg-[#f9fafb] !text-black border border-gray-200 rounded-xl 
              placeholder-gray-400 focus:outline-none focus:border-[#9d7857] 
              focus:ring-1 focus:ring-[#9d7857] transition"
            />

            {/* MESSAGE */}
            <textarea
              placeholder="رسالتك"
              rows="5"
              className="w-full px-5 py-4 !bg-[#f9fafb] !text-black border border-gray-200 rounded-xl 
              placeholder-gray-400 focus:outline-none focus:border-[#9d7857] 
              focus:ring-1 focus:ring-[#9d7857] transition resize-none"
            ></textarea>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-[#9d7857] text-white px-10 py-3 rounded-full 
              hover:opacity-90 transition duration-300 shadow-md"
            >
              إرسال
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
