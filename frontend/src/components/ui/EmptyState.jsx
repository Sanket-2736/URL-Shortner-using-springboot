export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}) => (
  <div className="py-12 text-center">
    {Icon && (
      <div className="flex justify-center mb-4">
        <Icon className="w-16 h-16 text-slate-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 mb-6 max-w-sm mx-auto">{description}</p>
    {action && actionLabel && (
      <button
        onClick={action}
        className="inline-flex items-center justify-center px-6 py-2.5 gradient-primary text-white rounded-lg font-semibold hover:shadow-lg-soft transition-all duration-200"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
