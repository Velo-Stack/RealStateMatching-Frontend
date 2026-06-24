import JoinUsOptionCard from '../JoinUsOptionCard';
import JoinUsFileUpload from '../JoinUsFileUpload';
import {
  FAL_LICENSE_OPTIONS,
  EXPERIENCE_OPTIONS,
  SPECIALIZATION_OPTIONS,
  JOIN_US_COLORS,
} from '../../constants/joinUsConstants';

const inputClass =
  'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors bg-white text-gray-800 focus:border-[#2D5016]';
const inputStyle = { borderColor: 'rgba(45, 80, 22, 0.3)' };
const labelClass = 'block text-sm font-medium text-gray-800 mb-1.5';

const Required = () => <span style={{ color: JOIN_US_COLORS.gold }}> *</span>;

const StepLicense = ({ form, updateField, updateFile, toggleArrayField }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">الرخصة والمهنة</h3>

    <div>
      <label className={labelClass}>رخصة فال<Required /></label>
      <div className="grid sm:grid-cols-3 gap-3">
        {FAL_LICENSE_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.hasFalLicense === o.value}
            onClick={() => updateField('hasFalLicense', o.value)}
          />
        ))}
      </div>
    </div>

    {form.hasFalLicense === 'yes' ? (
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>رقم رخصة فال<Required /></label>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.falLicenseNumber}
            onChange={(e) => updateField('falLicenseNumber', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>تاريخ انتهاء الرخصة<Required /></label>
          <input
            type="date"
            className={inputClass}
            style={inputStyle}
            value={form.licenseExpiry}
            onChange={(e) => updateField('licenseExpiry', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <JoinUsFileUpload
            label="مرفق رخصة فال"
            required
            file={form.files.fal_license}
            onChange={(file) => updateFile('fal_license', file)}
          />
        </div>
      </div>
    ) : null}

    <div>
      <label className={labelClass}>سنوات الخبرة<Required /></label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {EXPERIENCE_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.experienceYears === o.value}
            onClick={() => updateField('experienceYears', o.value)}
          />
        ))}
      </div>
    </div>

    <div>
      <label className={labelClass}>التخصصات<Required /></label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SPECIALIZATION_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            selected={form.specializations.includes(o.value)}
            onClick={() => toggleArrayField('specializations', o.value)}
          />
        ))}
      </div>
    </div>

    <JoinUsFileUpload
      label="مرفق شهادة (اختياري)"
      file={form.files.certificate}
      onChange={(file) => updateFile('certificate', file)}
    />
  </div>
);

export default StepLicense;
