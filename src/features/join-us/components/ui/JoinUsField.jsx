import { JOIN_US_COLORS } from '../../constants/joinUsConstants';
import { joinUsInputClass, joinUsInputStyle, joinUsLabelClass } from './joinUsTheme';

const Required = () => <span style={{ color: JOIN_US_COLORS.gold }}> *</span>;

const JoinUsField = ({
  label,
  required,
  children,
  error,
  className = '',
}) => (
  <div className={className}>
    {label ? (
      <label className={joinUsLabelClass}>
        {label}
        {required ? <Required /> : null}
      </label>
    ) : null}
    {children}
    {error ? <p className="text-red-600 text-xs mt-1.5">{error}</p> : null}
  </div>
);

export const JoinUsInput = ({ className = '', style, ...props }) => (
  <input
    className={`${joinUsInputClass} ${className}`}
    style={{ ...joinUsInputStyle, ...style }}
    {...props}
  />
);

export const JoinUsSelect = ({ className = '', style, children, ...props }) => (
  <select
    className={`${joinUsInputClass} ${className}`}
    style={{ ...joinUsInputStyle, ...style }}
    {...props}
  >
    {children}
  </select>
);

export const JoinUsTextarea = ({ className = '', style, ...props }) => (
  <textarea
    className={`${joinUsInputClass} resize-y min-h-[120px] ${className}`}
    style={{ ...joinUsInputStyle, ...style }}
    {...props}
  />
);

export default JoinUsField;
