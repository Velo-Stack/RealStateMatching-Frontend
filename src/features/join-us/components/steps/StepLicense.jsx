import JoinUsOptionCard from '../JoinUsOptionCard';
import JoinUsFileUpload from '../JoinUsFileUpload';
import JoinUsField, { JoinUsInput } from '../ui/JoinUsField';
import {
  FAL_LICENSE_OPTIONS,
  EXPERIENCE_OPTIONS,
  SPECIALIZATION_OPTIONS,
} from '../../constants/joinUsConstants';

const StepLicense = ({ form, updateField, updateFile, toggleArrayField }) => (
  <div className="space-y-6">
    <JoinUsField label="رخصة فال" required>
      <div className="grid sm:grid-cols-1 gap-3">
        {FAL_LICENSE_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.hasFalLicense === o.value}
            onClick={() => updateField('hasFalLicense', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    {form.hasFalLicense === 'yes' ? (
      <div className="grid md:grid-cols-2 gap-5">
        <JoinUsField label="رقم رخصة فال" required>
          <JoinUsInput
            value={form.falLicenseNumber}
            onChange={(e) => updateField('falLicenseNumber', e.target.value)}
          />
        </JoinUsField>
        <JoinUsField label="تاريخ انتهاء الرخصة" required>
          <JoinUsInput
            type="date"
            value={form.licenseExpiry}
            onChange={(e) => updateField('licenseExpiry', e.target.value)}
          />
        </JoinUsField>
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

    {form.hasFalLicense === 'pending' ? (
      <JoinUsFileUpload
        label="مرفق طلب الرخصة (إن وُجد)"
        file={form.files.fal_license}
        onChange={(file) => updateFile('fal_license', file)}
      />
    ) : null}

    <JoinUsField label="سنوات الخبرة" required>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPERIENCE_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.experienceYears === o.value}
            onClick={() => updateField('experienceYears', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    <JoinUsField label="التخصصات" required>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SPECIALIZATION_OPTIONS.map((o) => (
          <JoinUsOptionCard
            key={o.value}
            label={o.label}
            description={o.description}
            icon={o.Icon}
            selected={form.specializations.includes(o.value)}
            multi
            onClick={() => toggleArrayField('specializations', o.value)}
          />
        ))}
      </div>
    </JoinUsField>

    <JoinUsFileUpload
      label="مرفق شهادة (اختياري)"
      file={form.files.certificate}
      onChange={(file) => updateFile('certificate', file)}
    />
  </div>
);

export default StepLicense;
