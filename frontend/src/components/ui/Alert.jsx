const variants = {
  success: 'bg-green-50 border-green-200 text-green-900',
  danger: 'bg-red-50 border-red-200 text-red-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
};

const iconColors = {
  success: 'text-green-600',
  danger: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export const Alert = ({
  variant = 'info',
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) => {
  const variantClass = variants[variant] || variants.info;
  const iconColor = iconColors[variant] || iconColors.info;

  return (
    <div
      className={`
        p-4 rounded-lg border
        ${variantClass}
        animate-slide-in-up
        ${className}
      `}
    >
      <div className="flex gap-3">
        {Icon && <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />}
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        {action && actionLabel && (
          <button
            onClick={action}
            className="text-sm font-semibold whitespace-nowrap ml-4"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
