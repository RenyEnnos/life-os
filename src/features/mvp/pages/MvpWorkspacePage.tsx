import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, FileText, Target } from 'lucide-react';

import { getMvpSurfaces, mvpFoundationChecklist } from '@/features/mvp/data';
import { useMvpStore } from '@/features/mvp/store/useMvpStore';
import { getMvpRuntimeAccess } from '@/config/routes/access';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Card, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

export function MvpWorkspacePage() {
  const getAnalytics = useMvpStore((state) => state.getAnalytics);
  const analytics = getAnalytics();
  const { canAccessInternalAdmin } = getMvpRuntimeAccess();
  const mvpSurfaces = getMvpSurfaces(canAccessInternalAdmin);

  const workspaceMetrics = [
    {
      label: 'Loop readiness',
      value: analytics.weeklyPlanConfirmed ? 'Active' : analytics.onboardingCompleted ? 'Planning' : 'Intake',
      helper: 'Tracks whether the operator is still onboarding, planning the week, or executing.',
    },
    {
      label: 'Completed actions',
      value: `${analytics.completedActions} / ${analytics.totalActions || 0}`,
      helper: 'Finished next actions from the current weekly plan.',
    },
    {
      label: 'Reflection cadence',
      value: `${analytics.reflections}`,
      helper: 'Saved daily or weekly reflections captured in the MVP loop.',
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        title="LifeOS MVP"
        subtitle="Working workspace for the weekly operating loop, now wired as a usable client-side MVP."
        action={
          <Button asChild variant="outline">
            <Link to="/mvp/onboarding">Open Phase 1</Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {workspaceMetrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-sm text-zinc-400">{metric.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              MVP Surfaces
            </CardTitle>
          </CardHeader>

          <div className="grid gap-4 md:grid-cols-2">
            {mvpSurfaces.map((surface) => (
              <Link key={surface.slug} to={surface.path} className="group">
                <div className="rounded-2xl border border-white/8 bg-black/10 p-4 transition hover:border-white/15 hover:bg-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">{surface.phase}</span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      {surface.status}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{surface.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{surface.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-zinc-200">
                    Open surface
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Foundation Checklist
            </CardTitle>
          </CardHeader>

          <div className="space-y-3">
            {mvpFoundationChecklist.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-white/6 bg-black/10 p-3">
                {item.done ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                ) : (
                  <Clock3 className="mt-0.5 h-4 w-4 text-amber-300" />
                )}
                <p className="text-sm text-zinc-200">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/6 bg-black/10 p-4 text-sm text-zinc-400">
            Primary implementation artifacts live in `docs/mvp/` and `prisma/schema.prisma`.
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Current Product Constraint
            </CardTitle>
          </CardHeader>
          <p className="text-sm leading-6 text-zinc-300">
            The MVP remains a weekly operating loop, not a general productivity suite. This workspace now proves the loop end to end in the existing app while backend and auth decisions are still open.
          </p>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Immediate next work</CardTitle>
          </CardHeader>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>Replace local persistence with the final Postgres-backed contract.</li>
            <li>Gate the flow behind invite-only access for design partners.</li>
            <li>Mirror the local analytics events to the production telemetry path.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
