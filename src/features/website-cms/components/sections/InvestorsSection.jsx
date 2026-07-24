import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash, CheckCircle, ChartLineUp, Megaphone, Calendar, Star, FileText } from "phosphor-react";
import FormField from "../shared/FormField";
import {
  useInvestorStatsQuery,
  useInvestorStatsMutations,
  useInvestorContentQuery,
  useInvestorContentMutation,
  useInvestorEventsQuery,
  useInvestorEventsMutations,
  useInvestorAnnouncementsQuery,
  useInvestorAnnouncementsMutations,
  useInvestorAdvantagesQuery,
  useInvestorAdvantagesMutations,
} from "../../hooks/useInvestorsCmsMutations";

const InvestorsSection = () => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">إدارة صفحة علاقات المستثمرين</h2>
        <p className="text-sm text-slate-400">تحكم بجميع البيانات المعروضة في صفحة المستثمرين</p>
      </div>

      <StatsManager />
      <ContentManager />
      <EventsManager />
      <AnnouncementsManager />
      <AdvantagesManager />
    </div>
  );
};

// --- Stats Manager ---
const StatsManager = () => {
  const { data: stats } = useInvestorStatsQuery();
  const mutations = useInvestorStatsMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ label: "", value: "", icon: "", sortOrder: 0 });

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ label: "", value: "", icon: "", sortOrder: 0 });
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center p-4 hover:bg-emerald-500/10">
        <ChartLineUp size={24} className="text-emerald-400 ml-3" />
        <h3 className="text-lg font-bold text-white">إحصائيات وأرقام</h3>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-emerald-500/10">
              <form onSubmit={handleAdd} className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="الوصف" required><input required className="w-full rounded bg-black/20 p-2 text-white" value={form.label} onChange={e => setForm({...form, label: e.target.value})} /></FormField>
                <FormField label="القيمة" required><input required className="w-full rounded bg-black/20 p-2 text-white" value={form.value} onChange={e => setForm({...form, value: e.target.value})} /></FormField>
                <FormField label="الأيقونة"><input className="w-full rounded bg-black/20 p-2 text-white" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} /></FormField>
                <div className="flex items-end"><button type="submit" className="theme-button-primary w-full py-2">إضافة</button></div>
              </form>
              <div className="space-y-2">
                {stats?.map(s => (
                  <div key={s.id} className="flex justify-between items-center bg-black/20 p-3 rounded">
                    <div><span className="font-bold text-emerald-400">{s.value}</span> - {s.label}</div>
                    <button onClick={() => mutations.remove.mutate(s.id)} className="text-red-400 hover:text-red-300"><Trash size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Content Manager ---
const ContentManager = () => {
  const { data: contentData } = useInvestorContentQuery("chairman_message");
  const mutation = useInvestorContentMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  
  // Update state when data loads
  useState(() => {
    if(contentData) {
      setTitle(contentData.title || "");
      setBody(contentData.body || "");
    }
  }, [contentData]);

  const handleSave = () => {
    mutation.mutate({ key: "chairman_message", title, body });
  };

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center p-4 hover:bg-blue-500/10">
        <FileText size={24} className="text-blue-400 ml-3" />
        <h3 className="text-lg font-bold text-white">رسالة رئيس مجلس الإدارة</h3>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-blue-500/10 space-y-4">
              <FormField label="العنوان"><input className="w-full rounded bg-black/20 p-2 text-white" value={title} onChange={e => setTitle(e.target.value)} /></FormField>
              <FormField label="النص"><textarea rows={6} className="w-full rounded bg-black/20 p-2 text-white" value={body} onChange={e => setBody(e.target.value)} /></FormField>
              <button onClick={handleSave} className="theme-button-primary px-6 py-2">حفظ التغييرات</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Events Manager ---
const EventsManager = () => {
  const { data: events } = useInvestorEventsQuery();
  const mutations = useInvestorEventsMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ title: "", description: "", date: "" });
  };

  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center p-4 hover:bg-purple-500/10">
        <Calendar size={24} className="text-purple-400 ml-3" />
        <h3 className="text-lg font-bold text-white">الفعاليات والأحداث</h3>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-purple-500/10">
               <form onSubmit={handleAdd} className="mb-4 space-y-4">
                <FormField label="العنوان" required><input required className="w-full rounded bg-black/20 p-2 text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="التاريخ" required><input type="date" required className="w-full rounded bg-black/20 p-2 text-white" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></FormField>
                </div>
                <FormField label="الوصف"><textarea className="w-full rounded bg-black/20 p-2 text-white" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></FormField>
                <button type="submit" className="theme-button-primary px-6 py-2">إضافة فاعلية</button>
              </form>
              <div className="space-y-2 mt-4">
                {events?.map(e => (
                  <div key={e.id} className="flex justify-between items-center bg-black/20 p-3 rounded">
                    <div><span className="font-bold text-purple-400">{new Date(e.date).toLocaleDateString()}</span> - {e.title}</div>
                    <button onClick={() => mutations.remove.mutate(e.id)} className="text-red-400 hover:text-red-300"><Trash size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Announcements Manager ---
const AnnouncementsManager = () => {
  const { data: announcements } = useInvestorAnnouncementsQuery();
  const mutations = useInvestorAnnouncementsMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ title: "", body: "" });
  };

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center p-4 hover:bg-amber-500/10">
        <Megaphone size={24} className="text-amber-400 ml-3" />
        <h3 className="text-lg font-bold text-white">الإعلانات المالية</h3>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-amber-500/10">
              <form onSubmit={handleAdd} className="mb-4 space-y-4">
                <FormField label="عنوان الإعلان" required><input required className="w-full rounded bg-black/20 p-2 text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></FormField>
                <FormField label="التفاصيل"><textarea className="w-full rounded bg-black/20 p-2 text-white" value={form.body} onChange={e => setForm({...form, body: e.target.value})} /></FormField>
                <button type="submit" className="theme-button-primary px-6 py-2">نشر إعلان</button>
              </form>
              <div className="space-y-2 mt-4">
                {announcements?.map(a => (
                  <div key={a.id} className="flex justify-between items-center bg-black/20 p-3 rounded">
                    <div>{a.title}</div>
                    <button onClick={() => mutations.remove.mutate(a.id)} className="text-red-400 hover:text-red-300"><Trash size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Advantages Manager ---
const AdvantagesManager = () => {
  const { data: advantages } = useInvestorAdvantagesQuery();
  const mutations = useInvestorAdvantagesMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", icon: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ title: "", body: "", icon: "" });
  };

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center p-4 hover:bg-rose-500/10">
        <Star size={24} className="text-rose-400 ml-3" />
        <h3 className="text-lg font-bold text-white">مزايا الاستثمار</h3>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4 border-t border-rose-500/10">
               <form onSubmit={handleAdd} className="mb-4 space-y-4">
                <FormField label="الميزة" required><input required className="w-full rounded bg-black/20 p-2 text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></FormField>
                <FormField label="الشرح"><textarea className="w-full rounded bg-black/20 p-2 text-white" value={form.body} onChange={e => setForm({...form, body: e.target.value})} /></FormField>
                <button type="submit" className="theme-button-primary px-6 py-2">إضافة ميزة</button>
              </form>
              <div className="space-y-2 mt-4">
                {advantages?.map(a => (
                  <div key={a.id} className="flex justify-between items-center bg-black/20 p-3 rounded">
                    <div>{a.title}</div>
                    <button onClick={() => mutations.remove.mutate(a.id)} className="text-red-400 hover:text-red-300"><Trash size={20}/></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestorsSection;
