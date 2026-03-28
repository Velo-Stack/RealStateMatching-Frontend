import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const base = import.meta.env.BASE_URL || "/";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
    };

    const links = [
        "الرئيسية", "من نحن", "عن الشركة", "الخدمات", "العقارات",
        "القوائم", "آراء العملاء", "الأملاك", "المدونة", "الشهادات",
        "تواصل معنا", "العناصر", "الأسئلة الشائعة"
    ];

    return (
        <footer className="relative font-cairo bg-black text-white overflow-hidden">

            {/* Content */}
            <motion.div
                className="relative z-10 px-6 md:px-16 py-20 grid md:grid-cols-4 gap-x-8 gap-y-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {/* About (من نحن) */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-[15px] font-bold mb-8 border-b-2 border-[#9d7857] pb-2 inline-block uppercase tracking-wider">
                        من نحن
                    </h3>

                    <div className="overflow-hidden rounded-sm mb-8 relative group">
                        <img
                            src={`${base}images/footer.jpg`}
                            alt="عقار مميز"
                            className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    </div>

                    <div className="mb-6">
                        <img
                            src={`${base}rawash-white.png`}
                            alt="Rawash Logo"
                            className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </div>

                    <p className="text-[13px] text-gray-400 leading-[1.8] hover:text-gray-300 transition-colors">
                        نقدم أفضل الحلول العقارية بخبرة واسعة في السوق، ونساعدك على اتخاذ القرار الصحيح لتحقيق أهدافك. نسعى دائمًا لتقديم أفضل ما لدينا لخدمتكم.
                    </p>
                </motion.div>

                {/* Hours (ساعات العمل) */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-[15px] font-bold mb-8 border-b-2 border-[#9d7857] pb-2 inline-block uppercase tracking-wider">
                        ساعات العمل
                    </h3>

                    <div className="space-y-4 text-[13px] text-gray-400 mb-8">
                        <div className="flex justify-between border-b border-white/10 pb-3 hover:border-[#9d7857]/50 transition-colors">
                            <span>الاحد - الخميس</span>
                            <span>09 ص - 07 م</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-3 hover:border-[#9d7857]/50 transition-colors">
                            <span>السبت</span>
                            <span>09 ص - 02 م</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-3 hover:border-[#9d7857]/50 transition-colors">
                            <span>الجمعة</span>
                            <span className="text-[#9d7857] font-semibold">مغلق</span>
                        </div>
                    </div>

                    <div className="space-y-5 text-[13px] text-gray-400 mt-10">
                        <div className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9d7857]/20 transition-all duration-300">
                                <Phone className="w-4 h-4 text-[#9d7857]" />
                            </div>
                            <span dir="ltr" className="text-right group-hover:text-white transition-colors cursor-pointer">+966 500 000 000</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9d7857]/20 transition-all duration-300">
                                <Mail className="w-4 h-4 text-[#9d7857]" />
                            </div>
                            <span className="group-hover:text-white transition-colors cursor-pointer">info@rawash.com</span>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9d7857]/20 transition-all duration-300">
                                <MapPin className="w-4 h-4 text-[#9d7857]" />
                            </div>
                            <span className="leading-relaxed group-hover:text-white transition-colors mt-1">الرياض، المملكة العربية السعودية<br />الشارع الرئيسي، مبنى 3</span>
                        </div>
                    </div>
                </motion.div>

                {/* Useful Links (روابط مهمة) */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-[15px] font-bold mb-8 border-b-2 border-[#9d7857] pb-2 inline-block uppercase tracking-wider">
                        روابط مهمة
                    </h3>

                    <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-[13px] text-gray-400">
                        {links.map((link, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="group flex items-center gap-2 hover:text-[#9d7857] transition-all duration-300 hover:translate-x-[-4px]"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#9d7857] scale-0 group-hover:scale-100 transition-transform duration-300" />
                                {link}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Featured Properties (عقارات مميزة) */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-[15px] font-bold mb-8 border-b-2 border-[#9d7857] pb-2 inline-block uppercase tracking-wider">
                        عقارات مميزة
                    </h3>

                    <div className="overflow-hidden rounded-sm relative group cursor-pointer block">
                        <img
                            src={`${base}images/feature3.jpg`}
                            alt="عقارات مميزة"
                            className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-[#9d7857] font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">مشاهدة التفاصيل</span>
                        </div>
                    </div>
                </motion.div>

            </motion.div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-white/5 bg-[#050505] text-center w-full mt-4">
                <div className="relative mx-auto py-6 px-6 md:px-16 text-[13px] text-gray-500 flex flex-col items-center">
                    <p>حقوق النشر &copy; 2026 جميع الحقوق محفوظة | رواسخ العقارية</p>
                </div>
            </div>

        </footer>
    );
};

export default Footer;