import { forwardRef } from 'react';

export const Card = forwardRef(
  (
    {
      className = '',
      children,
      hoverEffect = false,
      border = true,
      shadow = 'md-soft',
      ...props
    },
    ref
  ) => {
    const shadowClasses = {
      'sm-soft': 'shadow-sm-soft',
      'md-soft': 'shadow-md-soft',
      'lg-soft': 'shadow-lg-soft',
      'xl-soft': 'shadow-xl-soft',
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white
          rounded-xl
          p-6
          transition-all
          duration-300
          ${border ? 'border border-slate-200' : ''}
          ${shadowClasses[shadow] || shadowClasses['md-soft']}
          ${hoverEffect ? 'hover:shadow-lg-soft hover:border-slate-300' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-bold text-slate-900 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`mt-6 pt-6 border-t border-slate-200 flex items-center justify-between gap-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);
