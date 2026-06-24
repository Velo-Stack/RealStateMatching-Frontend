import JoinUsOptionCard from '../JoinUsOptionCard';
import JoinUsFileUpload from '../JoinUsFileUpload';
import JoinUsField, { JoinUsTextarea } from '../ui/JoinUsField';
import JoinUsTrustBadge from '../ui/JoinUsTrustBadge';
import {
  TRAINING_OPTIONS,
  DEVELOPMENT_AREA_OPTIONS,
} from '../../constants/joinUsConstants';

const StepDevelopment = ({ form, updateField, updateFile, toggleArrayField }) => (
  <div className="space-y-6">
    <JoinUsField label="هل ترغب في برامج تدريبية؟" required>
      <div className="grid sm:grid-cols-2 gap-3">
        {TRAINING_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.wantsTraining === o.value}
            onClick={() => updateField('wantsTraining', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    <JoinUsField label="مجالات التطوير (اختياري)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEVELOPMENT_AREA_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.developmentAreas.includes(o.value)}
            multi
            onClick={() => toggleArrayField('developmentAreas', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    <JoinUsField label="بيئة العمل المثالية" required>
      <JoinUsTextarea
        value={form.dreamWorkEnvironment}
        onChange={(e) => updateField('dreamWorkEnvironment', e.target.value)}
        placeholder="صف بيئة العمل التي تحلم بها (10 أحرف على الأقل)"
      />
    </JoinUsField>

    <div className="grid md:grid-cols-2 gap-5">
      <JoinUsFileUpload
        label="السيرة الذاتية (CV)"
        required
        file={form.files.cv}
        onChange={(file) => updateFile('cv', file)}
      />
      <JoinUsFileUpload
        label="الهوية الوطنية (اختياري)"
        file={form.files.national_id}
        onChange={(file) => updateFile('national_id', file)}
      />
      <div className="md:col-span-2">
        <JoinUsFileUpload
          label="مرفقات أخرى (اختياري)"
          file={form.files.other}
          onChange={(file) => updateFile('other', file)}
        />
      </div>
    </div>

    <JoinUsTrustBadge />
  </div>
);

export default StepDevelopment;
