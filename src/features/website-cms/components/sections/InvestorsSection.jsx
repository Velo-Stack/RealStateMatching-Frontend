import { useState, useEffect } from "react";
import { Plus, Trash, ChartLineUp, Megaphone, Calendar, Star, FileText, CaretDown, CaretUp } from "phosphor-react";
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
import ImageUploadField from "../ImageUploadField";
import { useWebsiteImageUploadMutation } from "../../hooks/useWebsiteCmsMutations";
import { inputClasses, textAreaClasses } from "../../constants/websiteCmsConstants";

const InvestorsSection = ({ openKey, onToggle, onDraftChange }) => {
  return (
    <div className="space-y-3">
      <StatsManager
        isOpen={openKey === "stats"}
        onToggle={() => onToggle("stats")}
        onDraftChange={(draft) => onDraftChange("stats", draft)}
      />
      <AboutManager
        isOpen={openKey === "about"}
        onToggle={() => onToggle("about")}
        onDraftChange={(draft) => onDraftChange("content", { about_symbol: draft })}
      />
      <ContentManager
        isOpen={openKey === "chairman"}
        onToggle={() => onToggle("chairman")}
        onDraftChange={(draft) => onDraftChange("content", { chairman_message: draft })}
      />
      <EventsManager
        isOpen={openKey === "events"}
        onToggle={() => onToggle("events")}
        onDraftChange={(draft) => onDraftChange("events", draft)}
      />
      <AnnouncementsManager
        isOpen={openKey === "announcements"}
        onToggle={() => onToggle("announcements")}
        onDraftChange={(draft) => onDraftChange("announcements", draft)}
      />
      <AdvantagesManager
        isOpen={openKey === "advantages"}
        onToggle={() => onToggle("advantages")}
        onDraftChange={(draft) => onDraftChange("advantages", draft)}
      />
    </div>
  );
};

// ─── compact accordion wrapper ──────────────────────────────────────────────
// Note: colors use a static lookup map (not template-interpolated class names)
// so Tailwind's build-time scanner can actually find and keep these classes.

const ACCORDION_COLORS = {
  emerald: { border: "border-emerald-500/20", borderSoft: "border-emerald-500/10", bg: "bg-emerald-500/5", iconBg: "bg-emerald-500/20", iconText: "text-emerald-400" },
  blue: { border: "border-blue-500/20", borderSoft: "border-blue-500/10", bg: "bg-blue-500/5", iconBg: "bg-blue-500/20", iconText: "text-blue-400" },
  indigo: { border: "border-indigo-500/20", borderSoft: "border-indigo-500/10", bg: "bg-indigo-500/5", iconBg: "bg-indigo-500/20", iconText: "text-indigo-400" },
  purple: { border: "border-purple-500/20", borderSoft: "border-purple-500/10", bg: "bg-purple-500/5", iconBg: "bg-purple-500/20", iconText: "text-purple-400" },
  amber: { border: "border-amber-500/20", borderSoft: "border-amber-500/10", bg: "bg-amber-500/5", iconBg: "bg-amber-500/20", iconText: "text-amber-400" },
  rose: { border: "border-rose-500/20", borderSoft: "border-rose-500/10", bg: "bg-rose-500/5", iconBg: "bg-rose-500/20", iconText: "text-rose-400" },
};

const ManagerAccordion = ({ title, icon: Icon, color, isOpen, onToggle, children }) => {
  const c = ACCORDION_COLORS[color] || ACCORDION_COLORS.emerald;
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={`${c.iconBg} p-1.5 rounded-lg ${c.iconText}`}>
            {Icon && <Icon size={16} weight="duotone" />}
          </div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        {isOpen ? <CaretUp size={16} className="text-slate-400" /> : <CaretDown size={16} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className={`p-3 border-t ${c.borderSoft} space-y-3`}>{children}</div>
      )}
    </div>
  );
};

// --- Stats Manager ---
const StatsManager = ({ isOpen, onToggle, onDraftChange }) => {
  const { data: stats } = useInvestorStatsQuery();
  const mutations = useInvestorStatsMutations();
  const [form, setForm] = useState({ label: "", value: "", icon: "", sortOrder: 0 });

  useEffect(() => {
    onDraftChange(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ label: "", value: "", icon: "", sortOrder: 0 });
  };

  return (
    <ManagerAccordion title="إحصائيات وأرقام" icon={ChartLineUp} color="emerald" isOpen={isOpen} onToggle={onToggle}>
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <FormField label="الوصف" required><input required className={inputClasses} value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} /></FormField>
        <FormField label="القيمة" required><input required className={inputClasses} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} /></FormField>
        <FormField label="الأيقونة"><input className={inputClasses} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></FormField>
        <div className="flex items-end"><button type="submit" className="theme-button-primary w-full py-2 text-sm rounded-lg">إضافة</button></div>
      </form>
      <div className="space-y-2">
        {stats?.map(s => (
          <div key={s.id} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg text-sm">
            <div><span className="font-bold text-emerald-400">{s.value}</span> - {s.label}</div>
            <button onClick={() => mutations.remove.mutate(s.id)} className="text-red-400 hover:text-red-300"><Trash size={16} /></button>
          </div>
        ))}
      </div>
    </ManagerAccordion>
  );
};

// --- Content Manager (chairman message) ---
const ContentManager = ({ isOpen, onToggle, onDraftChange }) => {
  const { data: contentData } = useInvestorContentQuery("chairman_message");
  const mutation = useInvestorContentMutation();
  const uploadMutation = useWebsiteImageUploadMutation();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (contentData) {
      setTitle(contentData.title || "");
      setBody(contentData.body || "");
      setImageUrl(contentData.imageUrl || "");
      if (contentData.metadata) {
        setName(contentData.metadata.name || "");
        setRole(contentData.metadata.role || "");
      }
    }
  }, [contentData]);

  useEffect(() => {
    onDraftChange({ title, body, imageUrl, metadata: { name, role } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body, imageUrl, name, role]);

  const handleSave = () => {
    mutation.mutate({ key: "chairman_message", title, body, imageUrl, metadata: { name, role } });
  };

  return (
    <ManagerAccordion title="رسالة رئيس مجلس الإدارة" icon={FileText} color="blue" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="الاسم"><input className={inputClasses} value={name} onChange={e => setName(e.target.value)} /></FormField>
        <FormField label="المسمى الوظيفي"><input className={inputClasses} value={role} onChange={e => setRole(e.target.value)} /></FormField>
      </div>
      <FormField label="العنوان"><input className={inputClasses} value={title} onChange={e => setTitle(e.target.value)} /></FormField>
      <ImageUploadField label="صورة رئيس مجلس الإدارة" value={imageUrl} onChange={setImageUrl} uploadMutation={uploadMutation} />
      <FormField label="النص"><textarea rows={4} className={textAreaClasses} value={body} onChange={e => setBody(e.target.value)} /></FormField>
      <button onClick={handleSave} className="theme-button-primary px-5 py-2 text-sm rounded-lg">حفظ التغييرات</button>
    </ManagerAccordion>
  );
};

// --- About Manager (عن الشركة) ---
const AboutManager = ({ isOpen, onToggle, onDraftChange }) => {
  const { data: contentData } = useInvestorContentQuery("about_symbol");
  const mutation = useInvestorContentMutation();
  const uploadMutation = useWebsiteImageUploadMutation();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (contentData) {
      setTitle(contentData.title || "");
      setBody(contentData.body || "");
      setImageUrl(contentData.imageUrl || "");
    }
  }, [contentData]);

  useEffect(() => {
    onDraftChange({ title, body, imageUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body, imageUrl]);

  const handleSave = () => {
    mutation.mutate({ key: "about_symbol", title, body, imageUrl });
  };

  return (
    <ManagerAccordion title="عن الشركة" icon={FileText} color="indigo" isOpen={isOpen} onToggle={onToggle}>
      <FormField label="العنوان"><input className={inputClasses} value={title} onChange={e => setTitle(e.target.value)} /></FormField>
      <ImageUploadField label="صورة القسم" value={imageUrl} onChange={setImageUrl} uploadMutation={uploadMutation} />
      <FormField label="النص"><textarea rows={4} className={textAreaClasses} value={body} onChange={e => setBody(e.target.value)} /></FormField>
      <button onClick={handleSave} className="theme-button-primary px-5 py-2 text-sm rounded-lg">حفظ التغييرات</button>
    </ManagerAccordion>
  );
};

// --- Events Manager ---
const EventsManager = ({ isOpen, onToggle, onDraftChange }) => {
  const { data: events } = useInvestorEventsQuery();
  const mutations = useInvestorEventsMutations();
  const [form, setForm] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
    onDraftChange(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ title: "", description: "", date: "" });
  };

  return (
    <ManagerAccordion title="الفعاليات والأحداث" icon={Calendar} color="purple" isOpen={isOpen} onToggle={onToggle}>
      <form onSubmit={handleAdd} className="space-y-3">
        <FormField label="العنوان" required><input required className={inputClasses} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></FormField>
        <FormField label="التاريخ" required><input type="date" required className={inputClasses} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></FormField>
        <FormField label="الوصف"><textarea className={textAreaClasses} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></FormField>
        <button type="submit" className="theme-button-primary px-5 py-2 text-sm rounded-lg">إضافة فاعلية</button>
      </form>
      <div className="space-y-2">
        {events?.map(e => (
          <div key={e.id} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg text-sm">
            <div><span className="font-bold text-purple-400">{new Date(e.date).toLocaleDateString()}</span> - {e.title}</div>
            <button onClick={() => mutations.remove.mutate(e.id)} className="text-red-400 hover:text-red-300"><Trash size={16} /></button>
          </div>
        ))}
      </div>
    </ManagerAccordion>
  );
};

// --- Announcements Manager ---
const AnnouncementsManager = ({ isOpen, onToggle, onDraftChange }) => {
  const { data: announcements } = useInvestorAnnouncementsQuery();
  const mutations = useInvestorAnnouncementsMutations();
  const [form, setForm] = useState({ title: "", body: "" });

  useEffect(() => {
    onDraftChange(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ title: "", body: "" });
  };

  return (
    <ManagerAccordion title="الإعلانات المالية" icon={Megaphone} color="amber" isOpen={isOpen} onToggle={onToggle}>
      <form onSubmit={handleAdd} className="space-y-3">
        <FormField label="عنوان الإعلان" required><input required className={inputClasses} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></FormField>
        <FormField label="التفاصيل"><textarea className={textAreaClasses} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} /></FormField>
        <button type="submit" className="theme-button-primary px-5 py-2 text-sm rounded-lg">نشر إعلان</button>
      </form>
      <div className="space-y-2">
        {announcements?.map(a => (
          <div key={a.id} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg text-sm">
            <div>{a.title}</div>
            <button onClick={() => mutations.remove.mutate(a.id)} className="text-red-400 hover:text-red-300"><Trash size={16} /></button>
          </div>
        ))}
      </div>
    </ManagerAccordion>
  );
};

// --- Advantages Manager ---
const AdvantagesManager = ({ isOpen, onToggle, onDraftChange }) => {
  const { data: advantages } = useInvestorAdvantagesQuery();
  const mutations = useInvestorAdvantagesMutations();
  const [form, setForm] = useState({ title: "", body: "", icon: "" });

  useEffect(() => {
    onDraftChange(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleAdd = (e) => {
    e.preventDefault();
    mutations.create.mutate(form);
    setForm({ title: "", body: "", icon: "" });
  };

  return (
    <ManagerAccordion title="مزايا الاستثمار" icon={Star} color="rose" isOpen={isOpen} onToggle={onToggle}>
      <form onSubmit={handleAdd} className="space-y-3">
        <FormField label="الميزة" required><input required className={inputClasses} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></FormField>
        <FormField label="الشرح"><textarea className={textAreaClasses} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} /></FormField>
        <button type="submit" className="theme-button-primary px-5 py-2 text-sm rounded-lg">إضافة ميزة</button>
      </form>
      <div className="space-y-2">
        {advantages?.map(a => (
          <div key={a.id} className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg text-sm">
            <div>{a.title}</div>
            <button onClick={() => mutations.remove.mutate(a.id)} className="text-red-400 hover:text-red-300"><Trash size={16} /></button>
          </div>
        ))}
      </div>
    </ManagerAccordion>
  );
};

export default InvestorsSection;
