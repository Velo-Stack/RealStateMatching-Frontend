import JoinUsOptionCard from '../JoinUsOptionCard';
import {
  WORK_STYLE_OPTIONS,
  TECH_TOOL_OPTIONS,
  REWARD_SYSTEM_OPTIONS,
  JOIN_US_COLORS,
} from '../../constants/joinUsConstants';

const inputClass =
  'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors bg-white text-gray-800 focus:border-[#2D5016] resize-y min-h-[120px]';
const inputStyle = { borderColor: 'rgba(45, 80, 22, 0.3)' };
const labelClass = 'block text-sm font-medium text-gray-800 mb-1.5';

const Required = () => <span style={{ color: JOIN_US_COLORS.gold }}> *</span>;

const StepWork = ({ form, updateField, toggleArrayField }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">طبيعة العمل</h3>

    <div>
      <label className={labelClass}>طبيعة العمل المفضلة<Required /></label>
      <div className="grid sm:grid-cols-2 gap-3">
        {WORK_STYLE_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.preferredWorkStyle === o.value}
            onClick={() => updateField('preferredWorkStyle', o.value)}
          />
        ))}
      </div>
    </div>

    <div>
      <label className={labelClass}>التحديات الحالية في عملك<Required /></label>
      <textarea
        className={inputClass}
        style={inputStyle}
        value={form.currentChallenges}
        onChange={(e) => updateField('currentChallenges', e.target.value)}
        placeholder="صف التحديات التي تواجهها (10 أحرف على الأقل)"
      />
    </div>

    <div>
      <label className={labelClass}>الأدوات التقنية التي تستخدمها<Required /></label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TECH_TOOL_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.techTools.includes(o.value)}
            onClick={() => toggleArrayField('techTools', o.value)}
          />
        ))}
      </div>
    </div>

    <div>
      <label className={labelClass}>نظام العوائد المفضل<Required /></label>
      <div className="grid sm:grid-cols-2 gap-3">
        {REWARD_SYSTEM_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.rewardSystem === o.value}
            onClick={() => updateField('rewardSystem', o.value)}
          />
        ))}
      </div>
    </div>
  </div>
);

export default StepWork;
