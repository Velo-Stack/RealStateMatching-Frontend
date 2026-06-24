import JoinUsOptionCard from '../JoinUsOptionCard';
import JoinUsFileUpload from '../JoinUsFileUpload';
import {
  TRAINING_OPTIONS,
  DEVELOPMENT_AREA_OPTIONS,
  JOIN_US_COLORS,
} from '../../constants/joinUsConstants';

const inputClass =
  'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors bg-white text-gray-800 focus:border-[#2D5016] resize-y min-h-[120px]';
const inputStyle = { borderColor: 'rgba(45, 80, 22, 0.3)' };
const labelClass = 'block text-sm font-medium text-gray-800 mb-1.5';

const Required = () => <span style={{ color: JOIN_US_COLORS.gold }}> *</span>;

const StepDevelopment = ({ form, updateField, updateFile, toggleArrayField }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">التمكين والتطوير</h3>

    <div>
      <label className={labelClass}>هل ترغب في برامج تدريبية؟<Required /></label>
      <div className="grid sm:grid-cols-3 gap-3">
        {TRAINING_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.wantsTraining === o.value}
            onClick={() => updateField('wantsTraining', o.value)}
          />
        ))}
      </div>
    </div>

    <div>
      <label className={labelClass}>مجالات التطوير (اختياري)</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {DEVELOPMENT_AREA_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.developmentAreas.includes(o.value)}
            onClick={() => toggleArrayField('developmentAreas', o.value)}
          />
        ))}
      </div>
    </div>

    <div>
      <label className={labelClass}>بيئة العمل المثالية<Required /></label>
      <textarea
        className={inputClass}
        style={inputStyle}
        value={form.dreamWorkEnvironment}
        onChange={(e) => updateField('dreamWorkEnvironment', e.target.value)}
        placeholder="صف بيئة العمل التي تحلم بها (10 أحرف على الأقل)"
      />
    </div>

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

    <div
      className="rounded-xl p-4 text-sm text-gray-700 border"
      style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', borderColor: 'rgba(201, 168, 76, 0.35)' }}
    >
      جميع بياناتك محمية ومشفرة — لن تُشارك مع أي جهة خارجية
    </div>
  </div>
);

export default StepDevelopment;
