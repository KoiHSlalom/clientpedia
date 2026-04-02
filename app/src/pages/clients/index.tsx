import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import sample from '../../../data/sampleClients.json'
import { StatusBadge } from '../../components/StatusBadge'

export const getStaticProps = async () => {
  const openPositionIds = new Set(sample.openProjects.map((p: any) => p.clientId))
  const industries = Array.from(new Set(sample.clients.map((c: any) => c.industry))).sort()
  const locations = Array.from(new Set(sample.clients.map((c: any) => c.hq))).sort()
  const capabilities = Array.from(new Set(sample.clients.flatMap((c: any) => c.tags ?? []))).sort()

  return {
    props: {
      clients: sample.clients,
      openPositionClientIds: Array.from(openPositionIds),
      industries,
      locations,
      capabilities,
    },
  }
}

type Props = {
  clients: any[]
  openPositionClientIds: string[]
  industries: string[]
  locations: string[]
  capabilities: string[]
}

const ClientsIndex: React.FC<Props> = ({ clients, openPositionClientIds, industries, locations, capabilities }) => {
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [capability, setCapability] = useState('')
  const [openOnly, setOpenOnly] = useState(false)

  const openSet = useMemo(() => new Set(openPositionClientIds), [openPositionClientIds])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return clients.filter(c => {
      if (q && ![c.name, c.industry, c.hq, ...(c.tags ?? [])].join(' ').toLowerCase().includes(q)) return false
      if (industry && c.industry !== industry) return false
      if (location && c.hq !== location) return false
      if (capability && !(c.tags ?? []).includes(capability)) return false
      if (openOnly && !openSet.has(c.id)) return false
      return true
    })
  }, [clients, query, industry, location, capability, openOnly, openSet])

  const active = filtered.filter(c => c.engagementStatus === 'Active')
  const prospecting = filtered.filter(c => c.engagementStatus === 'Prospecting')
  const past = filtered.filter(c => c.engagementStatus === 'Past')
  const totalOpps = filtered.reduce((n: number, c: any) => n + c.opportunities.length, 0)

  const hasFilters = query || industry || location || capability || openOnly
  const clearAll = () => { setQuery(''); setIndustry(''); setLocation(''); setCapability(''); setOpenOnly(false) }

  const selectClass = 'form-select focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent'

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-ui-foreground">Clients</h1>
          <p className="text-sm text-ui-muted mt-0.5">
            {filtered.length === clients.length
              ? <>{clients.length} profiles &middot; {totalOpps} open opportunities</>
              : <><span className="font-medium text-ui-foreground">{filtered.length}</span> of {clients.length} profiles</>
            }
          </p>
        </div>
        <Link
          href="/clients/new"
          className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Add Client
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="card px-4 py-4 mb-4 space-y-3">
        {/* Search row */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-ui-muted pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, industry, location, or keyword…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-ui-foreground bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent placeholder:text-ui-muted"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute inset-y-0 right-3 flex items-center text-ui-muted hover:text-ui-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectClass}>
            <option value="">All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          <select value={location} onChange={e => setLocation(e.target.value)} className={selectClass}>
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <select value={capability} onChange={e => setCapability(e.target.value)} className={selectClass}>
            <option value="">All Capabilities</option>
            {capabilities.map(cap => <option key={cap} value={cap}>{cap}</option>)}
          </select>

          <label className="flex items-center gap-2 ml-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={e => setOpenOnly(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm text-ui-foreground">Has open position</span>
          </label>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="ml-auto text-xs text-ui-muted hover:text-ui-foreground underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Client cards */}
      {filtered.length === 0 ? (
        <div className="card px-6 py-12 text-center text-sm text-ui-muted">
          No clients match your search or filters.{' '}
          <button onClick={clearAll} className="text-brand-primary hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c: any) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="flex items-center justify-between card-interactive px-5 py-4 group"
            >
              {/* Name + tags */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-ui-foreground group-hover:text-brand-primary transition-colors">
                    {c.name}
                  </div>
                  {openSet.has(c.id) && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                      Open position
                    </span>
                  )}
                </div>
                <div className="mt-1 flex gap-1 flex-wrap">
                  {(c.tags ?? []).map((t: string) => (
                    <span
                      key={t}
                      className={`text-xs rounded px-1.5 py-0.5 ${t === capability && capability ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Industry / HQ */}
              <div className="hidden md:block text-xs text-ui-muted leading-snug w-44 flex-shrink-0">
                <div>{c.industry}</div>
                <div>{c.hq}</div>
              </div>

              {/* Opportunity count */}
              <div className="text-xs text-ui-muted w-16 text-center flex-shrink-0">
                <span className="text-sm font-semibold text-ui-foreground">{c.opportunities.length}</span>
                <div>opp{c.opportunities.length !== 1 ? 's' : ''}</div>
              </div>

              {/* Status badge */}
              <div className="flex-shrink-0 ml-2">
                <StatusBadge status={c.engagementStatus} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-5 mt-3 text-xs text-ui-muted">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{active.length} active</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{prospecting.length} prospecting</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neutral-300 inline-block" />{past.length} past</span>
      </div>
    </div>
  )
}

export default ClientsIndex

