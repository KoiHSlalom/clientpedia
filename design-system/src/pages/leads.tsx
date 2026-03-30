import React, { useState, useMemo } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import sample from '../../data/sampleClients.json'

// ── Types ────────────────────────────────────────────────────────────────────

type Consultant = {
  id: string
  name: string
  title: string
  skills: string[]
  experienceYears: number
  availability: string
  location: string
  matchScore: number
}

type Opportunity = {
  id: string
  title: string
  stage: string
  expectedStart: string
  estimatedDurationDays: number
  estimatedValue?: number
}

type Client = typeof sample.clients[number]

const OPP_STAGES = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

// ── Data ─────────────────────────────────────────────────────────────────────

export const getStaticProps = async () => {
  return {
    props: {
      clients: sample.clients,
      consultants: (sample as any).consultants as Consultant[],
    },
  }
}

type Props = {
  clients: Client[]
  consultants: Consultant[]
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LeadDashboard({ clients: initialClients = [], consultants = [] }: Props) {
  // Client state (supports inline-added opportunities)
  const [clients, setClients] = useState(initialClients)
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClients[0]?.id ?? '')

  // Add opportunity form
  const [showAddOpp, setShowAddOpp] = useState(false)
  const [newOppTitle, setNewOppTitle] = useState('')
  const [newOppStage, setNewOppStage] = useState('Prospecting')
  const [newOppValue, setNewOppValue] = useState('')

  // Consultant matching filters
  const [skillFilter, setSkillFilter] = useState('')
  const [availFilter, setAvailFilter] = useState('')

  // Assignments: consultantId → opportunityId
  const [assigned, setAssigned] = useState<Record<string, string>>({})

  const selectedClient = clients.find(c => c.id === selectedClientId)

  const allSkills = useMemo(
    () => [...new Set(consultants.flatMap(c => c.skills))].sort(),
    [consultants]
  )
  const availabilities = useMemo(
    () => [...new Set(consultants.map(c => c.availability))].sort(),
    [consultants]
  )

  const filteredConsultants = useMemo(() => {
    return consultants
      .filter(c => {
        if (skillFilter && !c.skills.includes(skillFilter)) return false
        if (availFilter && c.availability !== availFilter) return false
        return true
      })
      .sort((a, b) => b.matchScore - a.matchScore)
  }, [consultants, skillFilter, availFilter])

  // Add a new opportunity to the selected client
  const addOpportunity = () => {
    if (!newOppTitle.trim() || !selectedClientId) return
    const newOpp: Opportunity = {
      id: `O-NEW-${Date.now()}`,
      title: newOppTitle.trim(),
      stage: newOppStage,
      expectedStart: '2026-10-01',
      estimatedDurationDays: 90,
      ...(newOppValue ? { estimatedValue: parseInt(newOppValue) * 1000 } : {}),
    }
    setClients(prev =>
      prev.map(c =>
        c.id === selectedClientId
          ? { ...c, opportunities: [...c.opportunities, newOpp as any] }
          : c
      )
    )
    setNewOppTitle('')
    setNewOppValue('')
    setNewOppStage('Prospecting')
    setShowAddOpp(false)
  }

  const assignConsultant = (consultantId: string, oppId: string) => {
    setAssigned(prev => ({ ...prev, [consultantId]: oppId }))
  }

  const unassignConsultant = (consultantId: string) => {
    setAssigned(prev => {
      const next = { ...prev }
      delete next[consultantId]
      return next
    })
  }

  const controlClass = 'form-select text-xs w-full focus:outline-none focus:ring-2 focus:ring-brand-primary text-ui-foreground'

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">

      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ui-foreground">Engagement Lead Dashboard</h1>
        <p className="text-sm text-ui-muted mt-1">Manage clients, opportunities, and consultant matching</p>
      </div>

      {/* Three-column layout — fixed height with internal scroll */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '220px 1fr 300px', height: 'calc(100vh - 186px)', minHeight: 560 }}>

        {/* ── Column 1: Client list ── */}
        <div className="panel overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-ui-muted">Clients</span>
            <button className="text-xs font-semibold text-brand-primary hover:underline">+ Add</button>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-neutral-50">
            {clients.map(c => {
              const isActive = c.id === selectedClientId
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedClientId(c.id); setShowAddOpp(false) }}
                  className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                    isActive
                      ? 'bg-brand-primary/5 border-l-brand-primary'
                      : 'border-l-transparent hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-sm font-medium text-ui-foreground truncate">{c.name}</div>
                  <div className="text-xs text-ui-muted mt-0.5 truncate">{c.industry} · {c.hq}</div>
                  <div className="mt-1.5">
                    <StatusBadge status={c.engagementStatus} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Column 2: Opportunity management ── */}
        <div className="panel overflow-hidden flex flex-col">
          {selectedClient ? (
            <>
              {/* Client header */}
              <div className="px-5 py-4 border-b border-neutral-100 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-ui-foreground">{selectedClient.name}</h2>
                    <p className="text-xs text-ui-muted mt-0.5">
                      {selectedClient.industry} · {selectedClient.hq}
                    </p>
                  </div>
                  <StatusBadge status={selectedClient.engagementStatus} />
                </div>
                {/* Key contacts row */}
                {selectedClient.contacts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedClient.contacts.map(ct => (
                      <span key={ct.email} className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-600 rounded-full px-2.5 py-0.5">
                        <span className="font-medium">{ct.name}</span>
                        <span className="text-neutral-400">·</span>
                        <span>{ct.role}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

                {/* Opportunities */}
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-ui-foreground">
                      Opportunities
                      <span className="ml-1.5 text-xs font-normal text-ui-muted">
                        ({selectedClient.opportunities.length})
                      </span>
                    </h3>
                    <button
                      onClick={() => setShowAddOpp(v => !v)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        showAddOpp
                          ? 'bg-neutral-100 text-ui-foreground hover:bg-neutral-200'
                          : 'bg-brand-primary text-white hover:opacity-90'
                      }`}
                    >
                      {showAddOpp ? '✕ Cancel' : '+ Add Role'}
                    </button>
                  </div>

                  {/* Inline add form */}
                  {showAddOpp && (
                    <div className="card px-4 py-3 mb-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Role / opportunity title"
                        value={newOppTitle}
                        onChange={e => setNewOppTitle(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addOpportunity()}
                        className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-ui-muted"
                      />
                      <div className="flex gap-2">
                        <select
                          value={newOppStage}
                          onChange={e => setNewOppStage(e.target.value)}
                          className="flex-1 text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                          {OPP_STAGES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <input
                          type="number"
                          placeholder="Value $k"
                          value={newOppValue}
                          onChange={e => setNewOppValue(e.target.value)}
                          className="w-28 text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-ui-muted"
                        />
                      </div>
                      <button
                        onClick={addOpportunity}
                        disabled={!newOppTitle.trim()}
                        className="w-full py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      >
                        Save Opportunity
                      </button>
                    </div>
                  )}

                  {selectedClient.opportunities.length === 0 && !showAddOpp ? (
                    <div className="card px-4 py-8 text-center text-sm text-ui-muted">
                      No opportunities yet.{' '}
                      <button onClick={() => setShowAddOpp(true)} className="text-brand-primary hover:underline">
                        Add the first one
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedClient.opportunities.map((op: any) => (
                        <div key={op.id} className="card px-4 py-3 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-ui-foreground truncate">{op.title}</div>
                            <div className="text-xs text-ui-muted mt-0.5">
                              Starts {op.expectedStart} · {op.estimatedDurationDays}d
                              {op.estimatedValue && ` · $${(op.estimatedValue / 1000).toFixed(0)}k`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusBadge status={op.stage} />
                            <button
                              aria-label="Edit opportunity"
                              className="text-ui-muted hover:text-ui-foreground text-sm transition-colors"
                            >
                              ✏️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Past engagements */}
                {selectedClient.pastProjects.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-ui-foreground mb-2">
                      Past Engagements
                      <span className="ml-1.5 text-xs font-normal text-ui-muted">
                        ({selectedClient.pastProjects.length})
                      </span>
                    </h3>
                    <div className="divide-y divide-neutral-100 panel overflow-hidden">
                      {selectedClient.pastProjects.map((p, i) => (
                        <div key={i} className="px-4 py-2.5">
                          <div className="text-sm font-medium text-ui-foreground">{p.title}</div>
                          <div className="text-xs text-ui-muted mt-0.5">
                            {p.start?.slice(0, 7)} → {p.end?.slice(0, 7)} · {p.summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-ui-muted">
              Select a client to manage opportunities
            </div>
          )}
        </div>

        {/* ── Column 3: Consultant matching ── */}
        <div className="panel overflow-hidden flex flex-col">
          {/* Filter header */}
          <div className="px-4 py-3 border-b border-neutral-100 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-ui-muted">Consultant Match</h2>
              <span className="text-xs text-ui-muted">{filteredConsultants.length} result{filteredConsultants.length !== 1 ? 's' : ''}</span>
            </div>
            <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className={controlClass}>
              <option value="">All Skills</option>
              {allSkills.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={availFilter} onChange={e => setAvailFilter(e.target.value)} className={controlClass}>
              <option value="">Any Availability</option>
              {availabilities.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          {/* Consultant cards */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {filteredConsultants.length === 0 ? (
              <div className="text-center text-sm text-ui-muted py-8">
                No consultants match your filters.
              </div>
            ) : (
              filteredConsultants.map(con => {
                const isAssigned = con.id in assigned
                const assignedOppId = assigned[con.id]
                const assignedOpp = selectedClient?.opportunities.find((o: any) => o.id === assignedOppId)
                const scoreColor =
                  con.matchScore >= 90
                    ? 'bg-green-100 text-green-700'
                    : con.matchScore >= 80
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-neutral-100 text-neutral-600'

                return (
                  <div key={con.id} className="card px-3 py-3 space-y-2.5">
                    {/* Name + score */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {con.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-ui-foreground truncate">{con.name}</div>
                          <div className="text-xs text-ui-muted truncate">{con.title}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${scoreColor}`}>
                        {con.matchScore}%
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {con.skills.map(s => (
                        <span
                          key={s}
                          className={`text-xs rounded px-1.5 py-0.5 ${
                            s === skillFilter && skillFilter
                              ? 'bg-brand-primary/10 text-brand-primary font-medium'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Availability + experience */}
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          con.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {con.availability}
                      </span>
                      <span className="text-ui-muted">{con.location} · {con.experienceYears}y exp</span>
                    </div>

                    {/* Assign / assigned state */}
                    {isAssigned ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-green-700 font-medium truncate">
                          Assigned{assignedOpp ? `: ${assignedOpp.title}` : ''}
                        </span>
                        <button
                          onClick={() => unassignConsultant(con.id)}
                          className="text-xs text-ui-muted hover:text-ui-foreground ml-1 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <select
                        value=""
                        onChange={e => { if (e.target.value) assignConsultant(con.id, e.target.value) }}
                        disabled={!selectedClient || selectedClient.opportunities.length === 0}
                        className={`${controlClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="">
                          {!selectedClient || selectedClient.opportunities.length === 0
                            ? 'Select a client with open roles'
                            : 'Assign to opportunity…'}
                        </option>
                        {(selectedClient?.opportunities ?? []).map((op: any) => (
                          <option key={op.id} value={op.id}>{op.title}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
