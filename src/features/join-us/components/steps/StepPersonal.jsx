import {
  GENDER_OPTIONS,
  AGE_GROUP_OPTIONS,
  EDUCATION_OPTIONS,
} from '../../constants/joinUsConstants';
import JoinUsField, { JoinUsInput, JoinUsSelect } from '../ui/JoinUsField';
import JoinUsSearchableSelect from '../ui/JoinUsSearchableSelect';
import JoinUsTrustBadge from '../ui/JoinUsTrustBadge';

const StepPersonal = ({
  form,
  updateField,
  cityOptions,
  citiesLoading,
  errorField,
  errorMessage,
}) => {
  const fieldError = (key) => (errorField === key ? errorMessage : '');

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <JoinUsField
          label="الاسم الرباعي"
          required
          fieldKey="fullName"
          error={fieldError('fullName')}
          className="md:col-span-2"
        >
          <JoinUsInput
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="الاسم الكامل"
          />
        </JoinUsField>

        <JoinUsField label="الجنس" required fieldKey="gender" error={fieldError('gender')}>
          <JoinUsSelect
            value={form.gender}
            onChange={(e) => updateField('gender', e.target.value)}
          >
            <option value="">اختر...</option>
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </JoinUsSelect>
        </JoinUsField>

        <JoinUsField label="الفئة العمرية" required fieldKey="ageGroup" error={fieldError('ageGroup')}>
          <JoinUsSelect
            value={form.ageGroup}
            onChange={(e) => updateField('ageGroup', e.target.value)}
          >
            <option value="">اختر...</option>
            {AGE_GROUP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </JoinUsSelect>
        </JoinUsField>

        <JoinUsField label="المدينة / المنطقة" required fieldKey="cityId" error={fieldError('cityId')}>
          <JoinUsSearchableSelect
            value={form.cityId}
            onChange={(e) => updateField('cityId', e.target.value)}
            disabled={citiesLoading}
          >
            <option value="">
              {citiesLoading ? 'جاري التحميل...' : 'اختر...'}
            </option>
            {cityOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </JoinUsSearchableSelect>
        </JoinUsField>

        <JoinUsField label="رقم الجوال" required fieldKey="phone" error={fieldError('phone')}>
          <JoinUsInput
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
            placeholder="5xxxxxxxx"
            dir="ltr"
          />
        </JoinUsField>

        <JoinUsField label="البريد الإلكتروني" required fieldKey="email" error={fieldError('email')}>
          <JoinUsInput
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
          />
        </JoinUsField>

        <JoinUsField
          label="المؤهل العلمي"
          required
          fieldKey="education"
          error={fieldError('education')}
          className="md:col-span-2"
        >
          <JoinUsSelect
            value={form.education}
            onChange={(e) => updateField('education', e.target.value)}
          >
            <option value="">اختر...</option>
            {EDUCATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </JoinUsSelect>
        </JoinUsField>
      </div>

      <JoinUsTrustBadge compact />
    </div>
  );
};

export default StepPersonal;
