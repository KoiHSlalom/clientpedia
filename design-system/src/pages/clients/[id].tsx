import React from 'react'
import Link from 'next/link'
import sample from '../../../data/sampleClients.json'
import { StatusBadge } from '../../components/StatusBadge'

export const getStaticPaths = async () => {
  const paths = sample.clients.map((c: any) => ({ params: { id: c.id } }))
  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }: { params: { id: string } }) => {
  const client = sample.clients.find((c: any) => c.id === params.id) || null
  return { props: { client } }
}

const ClientPage: React.FC<{ client: any }> = ({ client }) => {
  if (!client) return <div className="p-6 text-ui-foreground">Client not found</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* Breadcrumb */}
      <nav className="text-xs text-ui-muted flex items-center gap-1.5">
        <Link href="/clients" className="hover:text-brand-primary transition-colors">Clients</Link>
        <span>/</span>
        <span className="text-ui-foreground font-medium">{client.name}</span>
      </nav>

      {/* Header card */}
      <div className="card px-6 py-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-ui-foreground">{client.name}</h1>
              <StatusBadge status={client.engagementStatus} />
            </div>
            <p className="text-sm text-ui-muted mt-0.5">{client.industry} · {client.hq}</p>
            <div className="mt-1.5 flex gap-1 flex-wrap">
              {(client.tags ?? []).map((t: string) => (
                <span key={t} className="text-xs bg-neutral-100 text-neutral-600 rounded px-1.5 py-0.5">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-ui-foreground max-w-md leading-relaxed">{client.summary}</p>
      </div>

      {/* Two-column body */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Left — Opportunities + Past projects */}
        <div className="md:col-span-2 space-y-5">

          {/* Opportunities */}
          <section>
            <h2 className="text-sm font-semibold text-ui-foreground mb-2">
              Opportunities
              <span className="ml-2 text-xs font-normal text-ui-muted">({client.opportunities.length})</span>
            </h2>
            {client.opportunities.length === 0 ? (
              <div className="card px-4 py-6 text-center text-sm text-ui-muted">
                No open opportunities — <Link href="/opportunities/new" className="text-brand-primary hover:underline">log one</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {client.opportunities.map((op: any) => (
                  <div key={op.id} className="flex items-start justify-between gap-4 card px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-ui-foreground">{op.title}</div>
                      <div className="text-xs text-ui-muted mt-0.5">
                        Starts {op.expectedStart} · {op.estimatedDurationDays}d
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StatusBadge status={op.stage} />
                      {op.estimatedValue && (
                        <span className="text-xs text-ui-muted">${(op.estimatedValue / 1000).toFixed(0)}k est.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active projects */}
          {(client.activeProjects ?? []).length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-ui-foreground mb-2">
                Active Projects
                <span className="ml-2 text-xs font-normal text-ui-muted">({client.activeProjects.length})</span>
              </h2>
              <div className="space-y-2">
                {client.activeProjects.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between card px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-ui-foreground">{p.title}</div>
                      <div className="text-xs text-ui-muted mt-0.5">Lead: {p.lead} · {p.startDate} → {p.endDate}</div>
                    </div>
                    <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Position Filled
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past projects */}
          <section>
            <h2 className="text-sm font-semibold text-ui-foreground mb-2">
              Past Engagements
              <span className="ml-2 text-xs font-normal text-ui-muted">({client.pastProjects.length})</span>
            </h2>
            {client.pastProjects.length === 0 ? (
              <div className="card px-4 py-6 text-center text-sm text-ui-muted">No past projects recorded.</div>
            ) : (
              <div className="divide-y divide-neutral-100 panel overflow-hidden">
                {client.pastProjects.map((p: any, i: number) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-ui-foreground">{p.title}</div>
                      <div className="text-xs text-ui-muted">{p.start?.slice(0, 7)} → {p.end?.slice(0, 7)}</div>
                    </div>
                    <p className="text-xs text-ui-muted mt-0.5">{p.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right — Contacts + Upcoming */}
        <div className="space-y-5">

          {/* Contacts */}
          <section>
            <h2 className="text-sm font-semibold text-ui-foreground mb-2">Key Contacts</h2>
            <div className="space-y-2">
              {client.contacts.map((ct: any) => (
                <div key={ct.email} className="flex items-center gap-3 card px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-500 flex-shrink-0">
                    {ct.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ui-foreground">{ct.name}</div>
                    <div className="text-xs text-ui-muted">{ct.role}</div>
                    <a href={`mailto:${ct.email}`} className="text-xs text-brand-primary hover:underline">{ct.email}</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming projects */}
          {client.upcomingProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-ui-foreground mb-2">Upcoming Projects</h2>
              <div className="space-y-2">
                {client.upcomingProjects.map((up: any, i: number) => (
                  <div key={i} className="card px-4 py-3">
                    <div className="text-sm font-medium text-ui-foreground">{up.title}</div>
                    <div className="text-xs text-ui-muted mt-0.5">
                      Starting {up.expectedStart} · {up.estimatedDurationDays}d
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientPage
