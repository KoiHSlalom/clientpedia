import React, { useState, useMemo } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import sample from '../../data/sampleClients.json'

// ── Types ────────────────────────────────────────────────────────────────────

type OppCard = {
  id: string
  title: string
  clientId: string
  clientName: string
  clientIndustry: string
  clientHq: string
  stage: string
  expectedStart: string
  estimatedDurationDays: number
  estimatedValue: number | null
  tags: string[]
}

// ── Data ─────────────────────────────────────────────────────────────────────

export const getStaticProps = async () => {
  const opportunities: OppCard[] = sample.clients.flatMap(c =>
    c.opportunities
      .filter(op => !['Closed Won', 'Closed Lost'].includes(op.stage))
      .map(op => ({
        id: op.id,
        title: op.title,
        clientId: c.id,
        clientName: c.name,
        clientIndustry: c.industry,
        clientHq: c.hq,
        stage: op.stage,
        expectedStart: op.expectedStart,
        estimatedDurationDays: op.estimatedDurationDays,
        estimatedValue: (op as any).estimatedValue ?? null,
        tags: c.tags,
      }))
  )

  const industries = [...new Set(sample.clients.map(c => c.industry))].sort()
  const locations = [...new Set(sample.clients.map(c => c.hq))].sort()
  const skills = [...new Set(sample.clients.flatMap(c => c.tags))].sort()
  const clients = sample.clients.map(c => ({ id: c.id, name: c.name }))

  return { props: { opportunities, industries, locations, skills, clients } }
}

type Props = {
  opportunities: OppCard[]
  industries: string[]
  locations: string[]
  skills: string[]
  clients: { id: string; name: string }[]
}

// ── Opportunity card ──────────────────────────────────────────────────────────

function OpportunityCard({
  op,
  isFav,
  isApplied,
  onToggleFav,
  onLearn,
  onApply,
}: {
  op: OppCard
  isFav: boolean
  isApplied: boolean
  onToggleFav: (id: string) => void
  onLearn: (id: string) => void
  onApply: (id: string) => void
}) {
  const startLabel = new Date(op.expectedStart).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="card px-4 py-4 flex flex-col gap-3 relative">
      {/* Favorite toggle */}
      <button
        onClick={() => onToggleFav(op.id)}
        aria-label={isFav ? 'Remove from saved' : 'Save opportunity'}
        className={`absolute top-3 right-3 text-xl leading-none transition-colors ${
          isFav ? 'text-red-500' : 'text-neutral-300 hover:text-red-400'
        }`}
      >
        {isFav ? '♥' : '♡'}
      </button>

      {/* Header */}
      <div className="pr-8">
        <div className="text-sm font-semibold text-ui-foreground leading-snug">{op.title}</div>
        <div className="text-xs text-ui-muted mt-0.5">{op.clientName} · {op.clientHq}</div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {op.tags.map(t => (
          <span key={t} className="text-xs bg-neutral-100 text-neutral-600 rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>

      {/* Stacked meta block */}
      <div className="flex flex-col text-xs text-ui-muted gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-ui-foreground">State:</span>
          <span className="truncate">{op.stage}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-ui-foreground">Potential Start date:</span>
          <span className="truncate">{new Date(op.expectedStart).toLocaleDateString('en-US')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-ui-foreground">Project Duration:</span>
          <span>{op.estimatedDurationDays}d</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-ui-foreground">Estimate:</span>
          <span>{op.estimatedValue ? `$${op.estimatedValue.toLocaleString()}` : 'TBD'}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onLearn(op.id)}
          className="flex-1 py-2 rounded-lg text-sm font-semibold border border-neutral-200 bg-white text-ui-foreground hover:bg-neutral-50"
        >
          Learn More
        </button>

        <button
          onClick={() => !isApplied && onApply(op.id)}
          disabled={isApplied}
          className={`w-36 py-2 rounded-lg text-sm font-semibold transition-all ${
            isApplied
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : 'bg-brand-primary text-white hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {isApplied ? '✓ Applied' : 'Apply →'}
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ConsultantDashboard({ opportunities, industries, locations, skills, clients = [] }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [applied, setApplied] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [skill, setSkill] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [sortBy, setSortBy] = useState('start_asc')
  const [savedOnly, setSavedOnly] = useState(false)

  const toggleFav = (id: string) =>
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const applyTo = (id: string) => setApplied(prev => new Set(prev).add(id))

  // Modal state for Learn More and Apply flows
  const [learnOp, setLearnOp] = useState<OppCard | null>(null)
  const [applyOp, setApplyOp] = useState<OppCard | null>(null)
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantNote, setApplicantNote] = useState('')

  const openLearn = (id: string) => setLearnOp(opportunities.find(o => o.id === id) ?? null)
  const closeLearn = () => setLearnOp(null)

  const openApply = (id: string) => setApplyOp(opportunities.find(o => o.id === id) ?? null)
  const closeApply = () => setApplyOp(null)

  const submitApplication = () => {
    if (!applyOp) return
    applyTo(applyOp.id)
    closeApply()
    setApplicantName('')
    setApplicantEmail('')
    setApplicantNote('')
  }

  const results = useMemo(() => {
    const q = query.toLowerCase()
    let out = opportunities.filter(op => {
      if (q && ![op.title, op.clientName, op.clientIndustry, op.clientHq, ...op.tags].join(' ').toLowerCase().includes(q)) return false
      if (clientFilter && op.clientId !== clientFilter) return false
      if (industry && op.clientIndustry !== industry) return false
      if (location && op.clientHq !== location) return false
      if (skill && !op.tags.includes(skill)) return false
      if (savedOnly && !favorites.has(op.id)) return false
      return true
    })

    // sorting
    const sorted = out.slice()
    if (sortBy === 'start_asc') {
      sorted.sort((a, b) => new Date(a.expectedStart).getTime() - new Date(b.expectedStart).getTime())
    } else if (sortBy === 'start_desc') {
      sorted.sort((a, b) => new Date(b.expectedStart).getTime() - new Date(a.expectedStart).getTime())
    } else if (sortBy === 'value_desc') {
      sorted.sort((a, b) => (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0))
    }

    return sorted
  }, [opportunities, query, clientFilter, industry, location, skill, savedOnly, favorites, sortBy])

  const favorited = opportunities.filter(op => favorites.has(op.id))
  const hasFilters = query || industry || location || skill || savedOnly || clientFilter
  const clearAll = () => { setQuery(''); setIndustry(''); setLocation(''); setSkill(''); setSavedOnly(false); setClientFilter('') }

  const uniqueClients = new Set(opportunities.map(o => o.clientId)).size
  const selectClass = 'form-select w-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent'

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ui-foreground">Find Your Next Engagement</h1>
        <p className="text-sm text-ui-muted mt-1">
          {opportunities.length} open roles across {uniqueClients} client{uniqueClients !== 1 ? 's' : ''}
          {applied.size > 0 && (
            <span className="ml-2 text-green-700 font-medium">· {applied.size} applied</span>
          )}
        </p>
      </div>

      <div className="flex gap-7">

        {/* ── Sidebar filters ── */}
        <aside className="w-52 flex-shrink-0 space-y-5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ui-muted mb-3">Filters</h2>

            {/* Search */}
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-3 flex items-center text-ui-muted pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search roles, clients…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-ui-muted"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute inset-y-0 right-2.5 flex items-center text-ui-muted hover:text-ui-foreground">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdowns */}
            <div className="space-y-2">
              <div className="select-wrapper">
                <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className={selectClass} aria-label="Filter by client">
                  <option value="">All Clients</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>

              <div className="select-wrapper">
                <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectClass}>
                  <option value="">All Industries</option>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>

              <div className="select-wrapper">
                <select value={location} onChange={e => setLocation(e.target.value)} className={selectClass}>
                  <option value="">All Locations</option>
                  {locations.map(l => <option key={l}>{l}</option>)}
                </select>
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>

              <div className="select-wrapper">
                <select value={skill} onChange={e => setSkill(e.target.value)} className={selectClass}>
                  <option value="">All Skills</option>
                  {skills.map(s => <option key={s}>{s}</option>)}
                </select>
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>

              {/* Sort control */}
              <div className="mt-1">
                <label className="text-xs text-ui-muted">Sort</label>
                <div className="select-wrapper mt-1">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select text-xs w-full">
                    <option value="start_asc">Start date — soonest first</option>
                    <option value="start_desc">Start date — latest first</option>
                    <option value="value_desc">Estimated value — high → low</option>
                    <option value="relevance">Relevance</option>
                  </select>
                  <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            {/* Saved toggle */}
            <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={savedOnly}
                onChange={e => setSavedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-ui-foreground">
                Saved only
                {favorites.size > 0 && (
                  <span className="ml-1 text-xs bg-red-100 text-red-600 rounded-full px-1.5 py-0.5 font-medium">
                    {favorites.size}
                  </span>
                )}
              </span>
            </label>

            {hasFilters && (
              <button onClick={clearAll} className="mt-2 text-xs text-ui-muted hover:text-ui-foreground underline underline-offset-2">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-7">

          {/* Saved section — visible only when there are favorites and not in saved-only mode */}
          {favorited.length > 0 && !savedOnly && (
            <section>
              <h2 className="text-sm font-semibold text-ui-foreground mb-3 flex items-center gap-2">
                <span className="text-red-500">♥</span>
                Saved
                <span className="text-xs font-normal text-ui-muted">({favorited.length})</span>
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {favorited.map(op => (
                  <OpportunityCard
                    key={op.id}
                    op={op}
                    isFav={true}
                    isApplied={applied.has(op.id)}
                    onToggleFav={toggleFav}
                    onLearn={openLearn}
                    onApply={openApply}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All / filtered opportunities */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-ui-foreground">
                {savedOnly ? 'Saved Opportunities' : hasFilters ? 'Matching Opportunities' : 'All Open Roles'}
                <span className="ml-2 text-xs font-normal text-ui-muted">({results.length})</span>
              </h2>
            </div>

            {results.length === 0 ? (
              <div className="card px-6 py-14 text-center">
                {savedOnly && favorites.size === 0 ? (
                  <>
                    <div className="text-3xl mb-3 text-neutral-300">♡</div>
                    <div className="text-sm font-semibold text-ui-foreground mb-1">No saved opportunities yet</div>
                    <div className="text-sm text-ui-muted">Click the heart on any role to save it here.</div>
                  </>
                ) : (
                  <div className="text-sm text-ui-muted">
                    No opportunities match your filters.{' '}
                    <button onClick={clearAll} className="text-brand-primary hover:underline">Clear filters</button>
                  </div>
                )}
              </div>
                ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {results.map(op => (
                  <OpportunityCard
                    key={op.id}
                    op={op}
                    isFav={favorites.has(op.id)}
                    isApplied={applied.has(op.id)}
                    onToggleFav={toggleFav}
                    onLearn={openLearn}
                    onApply={openApply}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      {/* Learn More Modal */}
      {learnOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card w-full max-w-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-ui-foreground">{learnOp.title}</h3>
                <div className="text-xs text-ui-muted mt-1">{learnOp.clientName} · {learnOp.clientIndustry} · {learnOp.clientHq}</div>
              </div>
              <button onClick={closeLearn} className="text-ui-muted hover:text-ui-foreground">✕</button>
            </div>
            <div className="mt-4 text-sm text-ui-foreground space-y-2">
              <div><strong>State:</strong> {learnOp.stage}</div>
              <div><strong>Potential Start date:</strong> {new Date(learnOp.expectedStart).toLocaleDateString('en-US')}</div>
              <div><strong>Project Duration:</strong> {learnOp.estimatedDurationDays}d</div>
              <div><strong>Estimate:</strong> {learnOp.estimatedValue ? `$${learnOp.estimatedValue.toLocaleString()}` : 'TBD'}</div>
              <div className="pt-2 text-sm text-ui-muted">No additional description is available for this prototype.</div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => { closeLearn(); openApply(learnOp.id) }} className="ml-auto bg-brand-primary text-white px-4 py-2 rounded-lg">Apply</button>
              <button onClick={closeLearn} className="px-4 py-2 rounded-lg border border-neutral-200 bg-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ui-foreground">Apply — {applyOp.title}</h3>
              <button onClick={closeApply} className="text-ui-muted hover:text-ui-foreground">✕</button>
            </div>

            <div className="mt-4 space-y-3">
              <input value={applicantName} onChange={e => setApplicantName(e.target.value)} placeholder="Your name" className="w-full form-select" />
              <input value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} placeholder="Email" className="w-full form-select" />
              <textarea value={applicantNote} onChange={e => setApplicantNote(e.target.value)} placeholder="Short note (optional)" className="w-full border border-neutral-200 rounded-lg px-3 py-2 min-h-[100px]" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={submitApplication} disabled={!applicantName.trim() || !applicantEmail.trim()} className="ml-auto bg-brand-primary text-white px-4 py-2 rounded-lg disabled:opacity-50">Submit Application</button>
              <button onClick={closeApply} className="px-4 py-2 rounded-lg border border-neutral-200 bg-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
