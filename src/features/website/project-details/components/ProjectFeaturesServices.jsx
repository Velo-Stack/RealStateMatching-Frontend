import {
  BadgeCheck,
  ConciergeBell,
  Droplets,
  Dumbbell,
  Fence,
  Flame,
  Flower2,
  KeyRound,
  ParkingSquare,
  ShieldCheck,
  Sparkles,
  Trees,
  Waves,
  Wrench,
} from "lucide-react";

const FEATURE_ICON_MAP = [
  { match: /مسبح|pool|swim/i, icon: Waves },
  { match: /نادي|جيم|رياض|gym|fitness/i, icon: Dumbbell },
  { match: /امن|أمن|حراسة|security/i, icon: ShieldCheck },
  { match: /نظاف|clean/i, icon: Sparkles },
  { match: /صيان|maintenance/i, icon: Wrench },
  { match: /موقف|باركن|parking/i, icon: ParkingSquare },
  { match: /حديق|lawn|garden|green/i, icon: Trees },
  { match: /تكييف|cooling|air/i, icon: Droplets },
  { match: /تدفئ|heating|heat/i, icon: Flame },
  { match: /زهور|ورد|flower/i, icon: Flower2 },
  { match: /سور|fence/i, icon: Fence },
  { match: /مفتاح|دخول|access|key/i, icon: KeyRound },
];

const getItemIcon = (label, fallback) => {
  const found = FEATURE_ICON_MAP.find((entry) => entry.match.test(label));
  return found?.icon || fallback;
};

const FeatureGrid = ({ title, items, fallbackIcon: FallbackIcon }) => {
  if (!items?.length) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-6 font-cairo" dir="rtl">
      <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-gray-900 sm:text-xl">
        <span className="inline-block h-5 w-1.5 rounded-full bg-[#9d7857]" />
        {title}
      </h3>

      <div className="rounded-xl bg-[#f7f8fa] p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item, index) => {
            const Icon = getItemIcon(item, FallbackIcon);
            return (
              <div
                key={`${item}-${index}`}
                className="flex flex-col items-center gap-2 rounded-xl bg-white px-3 py-4 text-center shadow-sm"
              >
                <Icon className="h-6 w-6 text-[#9d7857]" strokeWidth={1.7} />
                <span className="text-xs font-bold text-gray-800 sm:text-sm">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProjectFeaturesServices = ({ features = [], services = [] }) => {
  const hasFeatures = features?.length > 0;
  const hasServices = services?.length > 0;

  if (!hasFeatures && !hasServices) return null;

  return (
    <div className="space-y-5">
      {hasFeatures && (
        <FeatureGrid
          title="مميزات المشروع"
          items={features}
          fallbackIcon={BadgeCheck}
        />
      )}
      {hasServices && (
        <FeatureGrid
          title="الخدمات والمرافق"
          items={services}
          fallbackIcon={ConciergeBell}
        />
      )}
    </div>
  );
};

export default ProjectFeaturesServices;
