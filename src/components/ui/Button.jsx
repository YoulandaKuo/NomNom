export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-orange-400 hover:bg-orange-500 text-white px-6 py-3',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3',
    ghost:     'hover:bg-slate-100 text-slate-600 px-4 py-2',
    danger:    'bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
