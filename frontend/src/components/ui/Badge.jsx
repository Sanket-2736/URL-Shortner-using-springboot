const variants = {
  success: 'bg-green-100 text-green-800 border border-green-300',
  danger: 'bg-red-100 text-red-800 border border-red-300',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  info: 'bg-blue-100 text-blue-800 border border-blue-300',
  slate: 'bg-slate-100 text-slate-800 border border-slate-300',
  primary: 'bg-blue-100 text-blue-800 border border-blue-300',
};

const sizes = {
  sm: 'px-2 py-1 text-xs font-medium rounded-md',
  md: 'px-3 py-1.5 text-sm font-medium rounded-lg',
  lg: 'px-4 py-2 text-base font-semibold rounded-lg',
};

export const Badge = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantClass = variants[variant] || variants.slate;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
