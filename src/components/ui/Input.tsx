import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ label, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] text-txt-3 uppercase tracking-wider">{label}</label>}
      <input ref={ref} {...props}
        className={cn('bg-bg border border-border rounded px-3 py-2 text-sm text-txt font-mono outline-none focus:border-accent-2 transition-colors placeholder:text-txt-3', className)} />
    </div>
  )
)
Input.displayName = 'Input'
