import JoinUsOptionCard from '../JoinUsOptionCard';
import JoinUsField, { JoinUsTextarea } from '../ui/JoinUsField';
import {
  WORK_STYLE_OPTIONS,
  TECH_TOOL_OPTIONS,
  REWARD_SYSTEM_OPTIONS,
} from '../../constants/joinUsConstants';

const StepWork = ({ form, updateField, toggleArrayField }) => (
  <div className="space-y-6">
    <JoinUsField label="طبيعة العمل المفضلة" required>
      <div className="grid sm:grid-cols-1 gap-3">
        {WORK_STYLE_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.preferredWorkStyle === o.value}
            onClick={() => updateField('preferredWorkStyle', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    <JoinUsField label="التحديات الحالية في عملك" required>
      <JoinUsTextarea
        value={form.currentChallenges}
        onChange={(e) => updateField('currentChallenges', e.target.value)}
        placeholder="صف التحديات التي تواجهها (10 أحرف على الأقل)"
      />
    </JoinUsField>

    <JoinUsField label="الأدوات التقنية التي تستخدمها" required>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TECH_TOOL_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.techTools.includes(o.value)}
            multi
            onClick={() => toggleArrayField('techTools', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    <JoinUsField label="نظام العوائد المفضل" required>
      <div className="grid sm:grid-cols-1 gap-3">
        {REWARD_SYSTEM_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.rewardSystem === o.value}
            onClick={() => updateField('rewardSystem', o.value)}
          />
        ))}
      </div>
    </JoinUsField>
  </div>
);

export default StepWork;
