import { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon = null,
      fullWidth = true,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full
              ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5
              bg-white
              border
              rounded-lg
              text-slate-900
              placeholder-slate-500
              transition-colors
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-blue-500
              disabled:bg-slate-100
              disabled:text-slate-500
              disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 hover:border-slate-400'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm font-medium text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
