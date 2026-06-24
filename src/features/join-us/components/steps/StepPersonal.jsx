import {
  GENDER_OPTIONS,
  AGE_GROUP_OPTIONS,
  EDUCATION_OPTIONS,
  JOIN_US_COLORS,
} from '../../constants/joinUsConstants';

const inputClass =
  'w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors bg-white text-gray-800 focus:border-[#2D5016]';
const inputStyle = { borderColor: 'rgba(45, 80, 22, 0.3)' };
const labelClass = 'block text-sm font-medium text-gray-800 mb-1.5';

const Required = () => <span style={{ color: JOIN_US_COLORS.gold }}> *</span>;

const StepPersonal = ({ form, updateField, cityOptions, citiesLoading }) => (
  <div className="space-y-5">
    <h3 className="text-lg font-bold text-gray-900">البيانات الشخصية</h3>
    <div className="grid md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <label className={labelClass}>الاسم الرباعي<Required /></label>
        <input
          className={inputClass}
          style={inputStyle}
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="الاسم الكامل"
        />
      </div>
      <div>
        <label className={labelClass}>الجنس<Required /></label>
        <select
          className={inputClass}
          style={inputStyle}
          value={form.gender}
          onChange={(e) => updateField('gender', e.target.value)}
        >
          <option value="">اختر...</option>
          {GENDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>الفئة العمرية<Required /></label>
        <select
          className={inputClass}
          style={inputStyle}
          value={form.ageGroup}
          onChange={(e) => updateField('ageGroup', e.target.value)}
        >
          <option value="">اختر...</option>
          {AGE_GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>المدينة / المنطقة<Required /></label>
        <select
          className={inputClass}
          style={inputStyle}
          value={form.cityId}
          onChange={(e) => updateField('cityId', e.target.value)}
          disabled={citiesLoading}
        >
          <option value="">{citiesLoading ? 'جاري التحميل...' : 'اختر...'}</option>
          {cityOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>رقم الجوال<Required /></label>
        <input
          className={inputClass}
          style={inputStyle}
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="5xxxxxxxx"
          dir="ltr"
        />
      </div>
      <div>
        <label className={labelClass}>البريد الإلكتروني<Required /></label>
        <input
          type="email"
          className={inputClass}
          style={inputStyle}
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="example@email.com"
          dir="ltr"
        />
      </div>
      <div className="md:col-span-2">
        <label className={labelClass}>المؤهل العلمي<Required /></label>
        <select
          className={inputClass}
          style={inputStyle}
          value={form.education}
          onChange={(e) => updateField('education', e.target.value)}
        >
          <option value="">اختر...</option>
          {EDUCATION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default StepPersonal;
