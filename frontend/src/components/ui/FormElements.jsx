import { motion } from 'framer-motion';
import { ICON_COLOR, ICON_STROKE_WIDTH } from '../../constants/iconTheme';

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  error,
  helper,
  className = '',
  id,
  inputStyle = {},
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: ICON_COLOR }}>
            <Icon size={18} strokeWidth={ICON_STROKE_WIDTH} />
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type={type}
          name={name}
          id={id}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm transition-all duration-200 outline-none focus:outline-none ${Icon ? 'pl-11' : ''}`}
          style={{
            backgroundColor: '#EDEDE7',
            border: error ? '2px solid #ef4444' : '2px solid rgba(104, 159, 56, 0.25)',
            color: '#33691E',
            ...inputStyle,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#689F38';
            e.target.style.boxShadow = '0 0 0 4px rgba(104, 159, 56, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : 'rgba(104, 159, 56, 0.25)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {helper && !error && (
        <p className="text-xs" style={{ color: '#558B2F' }}>{helper}</p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  icon: Icon,
  required = false,
  error,
  className = '',
  id,
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: ICON_COLOR }}>
            <Icon size={18} strokeWidth={ICON_STROKE_WIDTH} />
          </div>
        )}
        <motion.select
          whileFocus={{ scale: 1.01 }}
          name={name}
          id={id}
          value={value ?? ''}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl transition-all duration-200 outline-none focus:outline-none appearance-none cursor-pointer ${Icon ? 'pl-11' : ''}`}
          style={{
            backgroundColor: '#EDEDE7',
            border: error ? '2px solid #ef4444' : '2px solid rgba(104, 159, 56, 0.25)',
            color: '#33691E'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#689F38';
            e.target.style.boxShadow = '0 0 0 4px rgba(104, 159, 56, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : 'rgba(104, 159, 56, 0.25)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#689F38' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function FormSlider({
  label,
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  showValue = true,
  required = false,
  error,
  helper,
  className = '',
  id,
}) {
  const safeValue = value ?? min;
  const percentage = ((safeValue - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {showValue && (
            <span className="text-sm font-bold" style={{ color: error ? '#EF4444' : '#689F38' }}>
              {safeValue}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(104, 159, 56, 0.2)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: error ? '#EF4444' : '#689F38' }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <input
          type="range"
          name={name}
          id={id}
          value={safeValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg pointer-events-none"
          style={{ 
            left: `calc(${percentage}% - 10px)`,
            backgroundColor: '#EDEDE7',
            border: `3px solid ${error ? '#EF4444' : '#689F38'}`
          }}
          animate={{ left: `calc(${percentage}% - 10px)` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: '#558B2F' }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {helper && !error && (
        <p className="text-xs" style={{ color: '#558B2F' }}>{helper}</p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}


export function FormToggle({
  label,
  name,
  checked,
  onChange,
  className = '',
}) {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${className}`}>
      <span className="text-sm font-medium" style={{ color: '#33691E' }}>{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          className="w-12 h-6 rounded-full transition-colors duration-200"
          style={{ backgroundColor: checked ? '#689F38' : 'rgba(104, 159, 56, 0.3)' }}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 rounded-full shadow"
            style={{ backgroundColor: '#EDEDE7' }}
            animate={{ left: checked ? '28px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>
    </label>
  );
}

export function FormButtonGroup({
  label,
  name,
  value,
  onChange,
  options,
  className = '',
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ target: { name, value: option.value } })}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: (value ?? '') === option.value ? '#689F38' : '#EDEDE7',
              color: (value ?? '') === option.value ? '#E5E7EB' : '#33691E',
              border: (value ?? '') === option.value ? '2px solid #689F38' : '2px solid rgba(104, 159, 56, 0.25)',
              boxShadow: (value ?? '') === option.value ? '0 4px 14px rgba(104, 159, 56, 0.25)' : 'none'
            }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function FormColorPicker({
  label,
  name,
  value,
  onChange,
  options,
  className = '',
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange({ target: { name, value: option.value } })}
            className="w-12 h-12 rounded-xl shadow-md transition-all duration-200"
            style={{ 
              backgroundColor: option.color,
              ring: (value ?? '') === option.value ? '4px solid #689F38' : 'none',
              boxShadow: (value ?? '') === option.value ? '0 0 0 4px rgba(104, 159, 56, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title={option.label}
          />
        ))}
      </div>
      <p className="text-xs capitalize" style={{ color: '#558B2F' }}>{options.find(o => o.value === (value ?? ''))?.label}</p>
    </div>
  );
}
export function FormCheckboxGroup({
  label,
  name,
  value = [],
  onChange,
  options,
  required = false,
  error,
  className = '',
  icon: Icon,
}) {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleCheckboxChange = (optionValue) => {
    let newValues;
    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      newValues = [...selectedValues, optionValue];
    }
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: selectedValues.includes(option.value) ? 'rgba(104, 159, 56, 0.1)' : '#EDEDE7',
              borderColor: selectedValues.includes(option.value) ? '#689F38' : 'rgba(104, 159, 56, 0.25)',
            }}
            onClick={() => handleCheckboxChange(option.value)}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{
                accentColor: '#689F38',
              }}
            />
            <label className="ml-3 flex-1 cursor-pointer text-sm font-medium" style={{ color: '#33691E' }}>
              {option.label}
            </label>
          </motion.div>
        ))}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}