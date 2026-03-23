import { useState } from 'react'

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="accordion">
      <button
        className={`accordion-header${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className="arrow">▼</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  )
}

export default Accordion
