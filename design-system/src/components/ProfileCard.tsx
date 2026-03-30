import React from 'react'

type ProfileCardProps = {
  name: string
  /** Used for role/title line in consultant cards */
  title?: string
  org?: string
  /** Used for industry/location subtitle in client cards */
  subtitle?: string
  /** Short bio or summary shown below the subtitle */
  description?: string
  avatarUrl?: string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, title, org, subtitle, description, avatarUrl }) => {
  const secondLine = subtitle ?? `${title ?? ''}${org ? ` · ${org}` : ''}`
  return (
    <div className="p-6 rounded-lg bg-surface-border shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
          {avatarUrl ? <img src={avatarUrl} alt={name} /> : null}
        </div>
        <div>
          <div className="text-xl font-bold text-ui-foreground">{name}</div>
          {secondLine && <div className="text-sm text-ui-muted">{secondLine}</div>}
        </div>
      </div>
      {description && <p className="mt-4 text-ui-foreground">{description}</p>}
    </div>
  )
}

export default ProfileCard
