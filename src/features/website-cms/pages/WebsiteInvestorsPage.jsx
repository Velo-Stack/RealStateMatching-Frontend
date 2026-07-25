import React from "react";
import StickyActionBar from "../components/shared/StickyActionBar";
import InvestorsSection from "../components/sections/InvestorsSection";
import { motion } from "framer-motion";

const WebsiteInvestorsPage = () => {
  return (
    <div className="space-y-6 pb-12 font-cairo" dir="rtl">
      <StickyActionBar 
        title="علاقات المستثمرين"
        subtitle="إدارة أقسام وبيانات صفحة علاقات المستثمرين العامة"
        isDirty={false} 
        isSaving={false}
        saveLabel="التغييرات تُحفظ فورياً"
        onSave={() => {}}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <InvestorsSection />
      </motion.div>
    </div>
  );
};

export default WebsiteInvestorsPage;
