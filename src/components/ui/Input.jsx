export function Input({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-bold text-slate-600">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-400 focus:outline-none bg-white text-slate-800 placeholder-slate-400 transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-bold text-slate-600">{label}</label>}
      <textarea
        rows={3}
        className={`w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-orange-400 focus:outline-none bg-white text-slate-800 placeholder-slate-400 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
