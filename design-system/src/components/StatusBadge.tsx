import React from 'react'

// Colour map: badge background + text for every status value used across the app
const statusStyles: Record<string, string> = {
  // Engagement status
  Active:       'bg-green-100 text-green-700',
  Past:         'bg-neutral-100 text-neutral-500',
  // Opportunity stages
  Prospecting:  'bg-blue-100 text-blue-700',
  Qualified:    'bg-blue-100 text-blue-700',
  Proposal:     'bg-yellow-100 text-yellow-700',
  Negotiation:  'bg-orange-100 text-orange-700',
  'Closed Won': 'bg-green-100 text-green-700',
  'Closed Lost':'bg-red-100 text-red-600',
  // Project health
  'On Track':   'bg-green-100 text-green-700',
  'In Progress':'bg-blue-100 text-blue-700',
  'At Risk':    'bg-orange-100 text-orange-700',
  Delayed:      'bg-red-100 text-red-600',
}

// Tooltip descriptions shown on hover (desktop) and focus/tap (mobile)
const tooltips: Record<string, string> = {
  // Engagement status
  Active:
    'Currently engaged — Slalom has active projects or opportunities with this client.',
  Past:
    'Engagement complete — no active projects or open opportunities at this time.',
  // Opportunity stages + engagement Prospecting share this description
  Prospecting:
    'Early stage — exploring fit and identifying potential engagement opportunities.',
  Qualified:
    'Client need is confirmed and a solution approach is being defined.',
  Proposal:
    'A proposal has been submitted and is awaiting client review.',
  Negotiation:
    'Terms are under discussion — close to reaching an agreement.',
  'Closed Won':
    'Engagement secured — the project is moving to delivery.',
  'Closed Lost':
    'This opportunity did not convert to an engagement.',
  // Project health
  'On Track':
    'Project is progressing as planned against timeline and budget.',
  'In Progress':
    'Work is underway and proceeding normally.',
  'At Risk':
    'Identified risks may impact delivery timeline or quality.',
  Delayed:
    'Project timeline has slipped from the original plan.',
}

type StatusBadgeProps = {
  status: string
  className?: string
}

/**
 * StatusBadge renders a pill badge with a hover/focus tooltip describing the status.
 * Uses Tailwind named groups (group/badge) so the tooltip only fires on the badge
 * itself, not on any outer row that also uses `group`.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const style = statusStyles[status] ?? 'bg-neutral-100 text-neutral-500'
  const tip   = tooltips[status]

  return (
    <span className={`relative inline-flex group/badge ${className}`}>
      {/* The badge pill itself — tabIndex so mobile tap gives focus → shows tooltip */}
      <span
        tabIndex={0}
        className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-default select-none outline-none ${style}`}
      >
        {status}
      </span>

      {/* Tooltip — visible on hover and on keyboard/tap focus */}
      {tip && (
        <span
          role="tooltip"
          className={[
            'pointer-events-none',
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
            'w-52 px-2.5 py-1.5',
            'bg-neutral-900 text-white text-xs rounded shadow-lg',
            'opacity-0 group-hover/badge:opacity-100 group-focus-within/badge:opacity-100',
            'transition-opacity duration-150 z-50',
            'text-center leading-snug whitespace-normal',
          ].join(' ')}
        >
          {tip}
          {/* Caret */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
        </span>
      )}
    </span>
  )
}

export default StatusBadge
