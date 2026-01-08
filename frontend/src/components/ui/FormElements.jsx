import { motion } from 'framer-motion';

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
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#689F38' }}>
            <Icon size={18} weight="duotone" />
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm transition-all duration-200 outline-none focus:outline-none ${Icon ? 'pl-11' : ''}`}
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: '#689F38' }}>
            <Icon size={18} weight="duotone" />
          </div>
        )}
        <motion.select
          whileFocus={{ scale: 1.01 }}
          name={name}
          value={value}
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
  className = '',
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#33691E' }}>
            {label}
          </label>
          {showValue && (
            <span className="text-sm font-bold" style={{ color: '#689F38' }}>
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(104, 159, 56, 0.2)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#689F38' }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <input
          type="range"
          name={name}
          value={value}
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
            border: '3px solid #689F38'
          }}
          animate={{ left: `calc(${percentage}% - 10px)` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: '#558B2F' }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
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
              backgroundColor: value === option.value ? '#689F38' : '#EDEDE7',
              color: value === option.value ? '#FAF0BF' : '#33691E',
              border: value === option.value ? '2px solid #689F38' : '2px solid rgba(104, 159, 56, 0.25)',
              boxShadow: value === option.value ? '0 4px 14px rgba(104, 159, 56, 0.25)' : 'none'
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
              ring: value === option.value ? '4px solid #689F38' : 'none',
              boxShadow: value === option.value ? '0 0 0 4px rgba(104, 159, 56, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title={option.label}
          />
        ))}
      </div>
      <p className="text-xs capitalize" style={{ color: '#558B2F' }}>{options.find(o => o.value === value)?.label}</p>
    </div>
  );
}
