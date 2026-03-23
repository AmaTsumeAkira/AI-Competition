import { useState, type ReactNode } from 'react'

interface AccordionProps {
  title: string
  badge?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

export default function Accordion({ title, badge, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-blue-900">{title}</span>
          {badge}
        </div>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-700">{children}</div>}
    </div>
  )
}
