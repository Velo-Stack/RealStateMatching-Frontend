import { useRef } from "react";

const AboutSection = () => {
    const base = import.meta.env.BASE_URL || "/";

    return (
        <section className="bg-[#f8f9fa] pt-24 pb-10 font-cairo">
            <div className="grid md:grid-cols-2 gap-16 items-center px-6 md:px-16">

                {/* RIGHT SIDE (TEXT) */}
                <div className="text-right">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#2f2f2f] leading-tight mb-6">
                        مرحبًا بك في شركة رواسخ العقارية
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed mb-10">
                        نقدم لك أفضل الحلول العقارية بخبرة طويلة ورؤية حديثة تلبي احتياجاتك وتحقق تطلعاتك.
                    </p>

                    {/* IMAGE WITH BOX */}
                    <div className="relative w-full max-w-[520px] mr-auto">

                        <img
                            src={`${base}images/bg_1.jpg`}
                            className="w-full h-[320px] object-cover"
                        />

                        {/* Overlay Box */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-10 bg-[#2f2f2f] text-white p-8 max-w-[80%] shadow-xl">

                            <p className="text-lg leading-relaxed mb-6">
                                شراء العقارات أصبح أسهل مع خدماتنا المتكاملة وخبرتنا في السوق.
                            </p>

                            <button className="text-[#9d7857] flex items-center gap-2">
                                اقرأ المزيد →
                            </button>

                        </div>
                    </div>
                </div>

                {/* LEFT SIDE (IMAGE + BOX) */}
                <div className="relative w-full h-[520px]">

                    {/* Background box */}
                    <div className="relative w-full h-[520px] overflow-hidden">

                        {/* Image */}
                        <img
                            src={`${base}images/bg_2.jpg`}
                            alt="about"
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay (خفيف زي التصميم) */}
                        <div className="absolute inset-0 bg-black/20"></div>

                        {/* Overlay Content */}
                        <div className="absolute bottom-10 left-10 bg-[#2f2f2f] text-white p-8 max-w-[80%] shadow-xl">

                            <p className="text-lg leading-relaxed mb-6">
                                نوفر لك أفضل خيارات الإيجار بما يناسب احتياجاتك وأسلوب حياتك.
                            </p>

                            <button className="text-[#9d7857] flex items-center gap-2">
                                اقرأ المزيد →
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;