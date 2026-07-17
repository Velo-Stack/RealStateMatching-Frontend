import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CaretDown, Check, MagnifyingGlass } from 'phosphor-react';
import { joinUsInputClass, joinUsInputStyle } from './joinUsTheme';

const JoinUsSearchableSelect = ({
  className = '',
  style,
  children,
  value,
  onChange,
  disabled,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Parse children to extract options (assuming children are <option> elements)
  const options = React.Children.toArray(children).map((child) => ({
    value: child.props.value,
    label: child.props.children,
    disabled: child.props.disabled,
  }));

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const selectedLabel = selectedOption?.label || options[0]?.label || '';

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((o) =>
      String(o.label).toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const handleSelect = (val, isDisabled) => {
    if (isDisabled) return;
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`${joinUsInputClass} ${className} flex items-center justify-between gap-3 text-right disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ ...joinUsInputStyle, ...style, padding: '14px 16px' }}
        {...props}
      >
        <span className="truncate">{selectedLabel}</span>
        <CaretDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          weight="bold"
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl bg-white border-gray-100 ring-1 ring-black/5">
          <div className="p-3 border-b border-gray-100/80">
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث..."
                className="w-full rounded-lg bg-gray-50/80 border-none px-10 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/30 text-gray-800"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = String(option.value) === String(value);
                // Hide placeholder from options if we have other choices, or we can keep it.
                // Usually it's fine to keep it or disable it.
                if (option.value === '' && filteredOptions.length > 1) {
                  return null;
                }

                return (
                  <button
                    key={index} // fallback index just in case value is not unique
                    type="button"
                    onClick={() => handleSelect(option.value, option.disabled)}
                    disabled={option.disabled}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#2D5016]/10 text-[#2D5016] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check
                        size={16}
                        weight="bold"
                        className="shrink-0 text-[#2D5016]"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                لا توجد نتائج مطابقة
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinUsSearchableSelect;
