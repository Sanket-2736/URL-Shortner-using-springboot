import { forwardRef } from 'react';

const variants = {
  primary: 'gradient-primary text-white hover:shadow-lg-soft',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
  tertiary: 'text-slate-700 hover:bg-slate-100',
  danger: 'gradient-danger text-white hover:shadow-lg-soft',
  success: 'gradient-success text-white hover:shadow-lg-soft',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs font-medium',
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-5 py-2.5 text-base font-semibold',
  lg: 'px-6 py-3 text-base font-semibold',
  xl: 'px-8 py-3.5 text-lg font-bold',
};

export const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      children,
      isLoading = false,
      icon: Icon = null,
      iconPosition = 'left',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
