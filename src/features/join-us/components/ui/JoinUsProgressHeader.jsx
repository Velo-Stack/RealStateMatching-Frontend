import { JOIN_US_COLORS, JOIN_US_STEP_META } from '../../constants/joinUsConstants';
import { joinUsProgressGradient } from './joinUsTheme';

const JoinUsProgressHeader = ({ step }) => {
  const percent = Math.round((step / 4) * 100);
  const meta = JOIN_US_STEP_META[step - 1];

  return (
    <div className="mb-8" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">القسم {step} من 4</p>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">{meta?.title}</h2>
          {meta?.subtitle ? (
            <p className="text-sm text-gray-500 mt-0.5">{meta.subtitle}</p>
          ) : null}
        </div>
        <div
          className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-white font-bold text-sm shadow-lg"
          style={{ background: joinUsProgressGradient }}
        >
          <span className="text-lg leading-none">{percent}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {JOIN_US_STEP_META.map((item, index) => {
          const stepNum = index + 1;
          const done = step > stepNum;
          const active = step === stepNum;
          const Icon = item.Icon;

          return (
            <div key={item.title} className="flex items-center flex-1 min-w-0">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all ${
                  done || active ? 'text-white shadow-md' : 'bg-gray-100 text-gray-400'
                }`}
                style={
                  done || active
                    ? { backgroundColor: done ? JOIN_US_COLORS.green : JOIN_US_COLORS.gold }
                    : undefined
                }
              >
                {done ? (
                  <span className="text-sm">✓</span>
                ) : Icon ? (
                  <Icon size={18} weight={active ? 'fill' : 'regular'} />
                ) : (
                  <span className="text-xs font-bold">{stepNum}</span>
                )}
              </div>
              {index < JOIN_US_STEP_META.length - 1 ? (
                <div
                  className="flex-1 h-0.5 mx-1 rounded-full transition-all"
                  style={{
                    background:
                      step > stepNum
                        ? JOIN_US_COLORS.green
                        : 'rgba(45, 80, 22, 0.12)',
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%`, background: joinUsProgressGradient }}
        />
      </div>
    </div>
  );
};

export default JoinUsProgressHeader;
