import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/projects", label: "المشاريع" },
  { to: "/about", label: "من نحن" },
  { to: "/blog", label: "المدونة" },
  { to: "/contact", label: "تواصل معنا" },
  { to: "/investors", label: "علاقات المستثمرين" },
];

// طلب أبو سلطان: إخفاء رقم التواصل مؤقتًا، ونتركه هنا كتعليق لسهولة إرجاعه لاحقًا.
// const PHONE_NUMBER = "+9660500499849";
const TOP_BAR_HEIGHT = 52;
const NAV_LINK_CLASS_NAME =
  "relative py-1 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:text-[var(--accent-light)] after:absolute after:bottom-0 after:right-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-[#9d7857] after:transition-transform after:duration-300 hover:after:scale-x-100";

const MainNavBar = ({
  imageBasePath,
  open,
  onToggleMenu,
  floating = false,
  employeeEntryPath,
}) => (
  <div
    className={`flex items-center justify-between px-5 py-3.5 transition-[background-color,box-shadow,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-8 md:py-4 ${
      floating
        ? "bg-[rgba(3,3,3,0.92)] shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
        : "bg-black/40 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
    }`}
  >
    <button
      type="button"
      onClick={onToggleMenu}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-[var(--accent)]/30 hover:bg-white/10 hover:scale-105 md:hidden"
      aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
      aria-expanded={open}
    >
      <span
        className={`transition-all duration-300 ${open ? "rotate-90 scale-110" : ""}`}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </span>
    </button>

    <div className="hidden items-center gap-6 text-sm text-white md:flex">
      {/* أيقونة دخول الموظفين - أول حاجة على الشمال */}
      <Link
        to={employeeEntryPath}
        title="دخول الموظفين"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/70 transition-all duration-300 hover:border-[#9d7857]/60 hover:bg-[#9d7857]/15 hover:text-white hover:scale-105"
      >
        <LogIn size={16} strokeWidth={1.8} />
      </Link>

      {NAV_LINKS.map((link) => (
        <Link key={link.label} to={link.to} className={NAV_LINK_CLASS_NAME}>
          {link.label}
        </Link>
      ))}
    </div>

    <img
      src={`${imageBasePath}logo-white.png`}
      alt="رواسخ العقارية"
      className="w-10 transition-transform duration-300 hover:scale-[1.03]"
    />
  </div>
);

const MobileMenu = ({
  open,
  floating = false,
  onLinkClick,
  employeeEntryPath,
}) => (
  <div
    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
      open
        ? "max-h-[500px] opacity-100"
        : "pointer-events-none max-h-0 opacity-0"
    }`}
  >
    <div
      className={`flex flex-col px-6 pb-6 pt-4 backdrop-blur-xl ${
        floating ? "bg-[rgba(3,3,3,0.96)]" : "bg-black/95"
      }`}
    >
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.label}
            to={link.to}
            className="rounded-lg px-4 py-2.5 text-sm font-medium !text-white transition-all duration-300 hover:bg-white/5 hover:pr-5"
            onClick={onLinkClick}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mx-4 my-4 h-px bg-gradient-to-l from-transparent via-[var(--accent)]/30 to-transparent" />

      <div className="flex flex-col gap-3 px-2">
        {/* طلب أبو سلطان: إخفاء رقم التواصل مؤقتًا، ونترك الكود كتعليق لسهولة إرجاعه لاحقًا.
        <a
          href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`}
          dir="ltr"
          className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-[var(--accent)]/20 hover:bg-white/8"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#9d7857] text-white transition-colors duration-300 group-hover:bg-[#b08d6b]">
            <PhoneCall size={16} strokeWidth={1.8} />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white/90">
            {PHONE_NUMBER}
          </span>
        </a>
        */}

        <div className="overflow-hidden rounded-xl border border-white/5 bg-gradient-to-l from-white/[0.06] via-white/[0.03] to-transparent px-4 py-3 text-center text-xs tracking-[0.24em] text-white/45">
          RAWASIKH
        </div>

        <Link
          to={employeeEntryPath}
          onClick={onLinkClick}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#9d7857]/40 bg-gradient-to-l from-[#9d7857]/20 to-[#9d7857]/10 px-4 py-3 text-sm font-semibold !text-white transition-all duration-300 hover:border-[#9d7857]/70 hover:from-[#9d7857]/30 hover:to-[#9d7857]/15"
        >
          <LogIn size={16} />
          دخول الموظفين
        </Link>
      </div>
    </div>
  </div>
);

const PublicNavbar = () => {
  const { user, loading } = useAuth();
  const imageBasePath = import.meta.env.BASE_URL || "/";
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const employeeEntryPath = !loading && user ? "/app" : "/login";

  useEffect(() => {
    let frameId = 0;

    const updateScrollState = () => {
      frameId = 0;
      const nextState = window.scrollY > TOP_BAR_HEIGHT;
      setIsScrolled((current) => (current === nextState ? current : nextState));
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateScrollState);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header dir="rtl" className="absolute top-0 left-0 z-50 w-full">
        <MainNavBar
          imageBasePath={imageBasePath}
          open={open}
          onToggleMenu={() => setOpen((current) => !current)}
          employeeEntryPath={employeeEntryPath}
        />
        <MobileMenu
          open={!isScrolled && open}
          onLinkClick={() => setOpen(false)}
          employeeEntryPath={employeeEntryPath}
        />
      </header>

      <div
        dir="rtl"
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <MainNavBar
          imageBasePath={imageBasePath}
          open={open}
          onToggleMenu={() => setOpen((current) => !current)}
          floating
          employeeEntryPath={employeeEntryPath}
        />
        <MobileMenu
          open={isScrolled && open}
          floating
          onLinkClick={() => setOpen(false)}
          employeeEntryPath={employeeEntryPath}
        />
      </div>
    </>
  );
};

export default PublicNavbar;
