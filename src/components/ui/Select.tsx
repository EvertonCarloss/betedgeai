import { cn } from '@/lib/utils'
import { SelectHTMLAttributes, forwardRef } from 'react'
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ label, className, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] text-txt-3 uppercase tracking-wider">{label}</label>}
      <select ref={ref} {...props}
        className={cn('bg-bg border border-border rounded px-3 py-2 text-sm text-txt font-mono outline-none focus:border-accent-2 transition-colors', className)}>
        {children}
      </select>
    </div>
  )
)
Select.displayName = 'Select'
