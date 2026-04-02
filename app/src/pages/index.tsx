import React from 'react'
import Link from 'next/link'
import data from '../../data/sampleClients.json'
import { StatusBadge } from '../components/StatusBadge'

export const getStaticProps = async () => {
  const featured = data.clients.filter(c => data.featuredClients.includes(c.id))
  const allOpps = data.clients.flatMap(c => c.opportunities)
  const activeOpps = allOpps.filter(o => !['Closed Won', 'Closed Lost'].includes(o.stage))
  return {
    props: {
      stats: {
        totalClients: data.clients.length,
        activeOpportunities: activeOpps.length,
        consultantsAvailable: data.consultantsAvailable,
        recentUpdates: data.recentActivity.length,
      },
      recentActivity: data.recentActivity,
      quickActions: data.quickActions,
      featuredClients: featured,
      openProjects: data.openProjects,
    },
  }
}

const activityIcons: Record<string, string> = {
  opportunity: '💼',
  profile: '👤',
  project: '✅',
}

type Stats = { totalClients: number; activeOpportunities: number; consultantsAvailable: number; recentUpdates: number }

type Props = {
  stats: Stats
  recentActivity: typeof data.recentActivity
  quickActions: typeof data.quickActions
  featuredClients: typeof data.clients
  openProjects: typeof data.openProjects
}

export default function Home({ stats, recentActivity, quickActions, featuredClients, openProjects }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* ── Hero ── */}
      <section className="bg-brand-primary rounded-xl px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Your internal knowledge base<br className="hidden md:block" /> for every client relationship.
          </h1>
          <p className="mt-3 text-base text-white/80 max-w-xl">
            Clientpedia centralizes client profiles, past engagements, open opportunities, and consultant matchmaking — so every Slalom team member has the context they need, instantly.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/clients" className="bg-white text-brand-primary font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-neutral-100 transition-colors">
            Browse Clients
          </Link>
          <Link href="/consultants" className="border border-white text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
            Find Consultants
          </Link>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ui-muted mb-3">At a Glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Clients', value: stats.totalClients },
            { label: 'Active Opportunities', value: stats.activeOpportunities },
            { label: 'Consultants Available', value: stats.consultantsAvailable },
            { label: 'Updates This Week', value: stats.recentUpdates },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4">
              <div className="text-2xl font-bold text-ui-foreground">{s.value}</div>
              <div className="text-xs text-ui-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main two-column grid ── */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Left 2/3 — Featured clients + Recent activity */}
        <div className="md:col-span-2 space-y-6">

          {/* Featured clients */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-ui-foreground">Featured Clients</h2>
              <Link href="/clients" className="text-xs text-brand-primary hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {featuredClients.map(c => (
                <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center justify-between card-interactive px-4 py-3 group">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ui-foreground group-hover:text-brand-primary transition-colors">{c.name}</div>
                    <div className="text-xs text-ui-muted mt-0.5">{c.industry} · {c.hq}</div>
                    <p className="text-xs text-ui-muted mt-1 truncate">{c.summary ? (c.summary.length > 90 ? c.summary.slice(0, 90) + '…' : c.summary) : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ui-muted">{c.opportunities.length} opp{c.opportunities.length !== 1 ? 's' : ''}</span>
                    <StatusBadge status={c.engagementStatus} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Open projects */}
          <section>
            <h2 className="text-sm font-semibold text-ui-foreground mb-2">
              Open Projects
              <span className="ml-2 text-xs font-normal text-ui-muted">({openProjects.length} unfilled)</span>
            </h2>
            <div className="space-y-2">
              {openProjects.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/clients/${p.clientId}`}
                  className="flex items-start justify-between gap-4 card-interactive px-4 py-3 group/row"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ui-foreground group-hover/row:text-brand-primary transition-colors">{p.title}</div>
                    <div className="text-xs text-ui-muted mt-0.5">{p.client} · <span className="font-medium text-ui-foreground">{p.role}</span></div>
                    <p className="text-xs text-ui-muted mt-1.5 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right text-xs text-ui-muted leading-snug">
                    <div>Starts</div>
                    <div className="font-medium text-ui-foreground">{p.expectedStart}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <h2 className="text-sm font-semibold text-ui-foreground mb-3">Recent Activity</h2>
            <div className="space-y-2">
              {recentActivity.map(a => (
                <div key={a.id} className="flex items-start gap-3 card px-4 py-3">
                  <span className="text-base mt-0.5">{activityIcons[a.type] ?? '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ui-foreground leading-snug">{a.text}</p>
                    <p className="text-xs text-ui-muted mt-0.5">{a.client} · {new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 1/3 — Quick actions */}
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-ui-foreground mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              {quickActions.map(qa => (
                <Link
                  key={qa.id}
                  href={qa.href}
                  className="flex items-center gap-3 card-interactive px-4 py-3 text-sm font-medium text-ui-foreground hover:text-brand-primary"
                >
                  <span className="w-5 text-center text-base">
                    {qa.icon === 'plus' ? '＋' : qa.icon === 'briefcase' ? '💼' : qa.icon === 'users' ? '👥' : '☰'}
                  </span>
                  {qa.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Mini tip / info block */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-4">
            <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Pilot note</h3>
            <p className="text-xs text-ui-foreground leading-relaxed">
              Clientpedia is currently in pilot. Add your market's top 10 client profiles and flag an opportunity to validate the intake flow.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

