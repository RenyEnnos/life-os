import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

import { getMvpSurfaces } from '@/features/mvp/data';
import { useMvpStore } from '@/features/mvp/store/useMvpStore';
import { trackMvpSurfaceViewed } from '@/features/mvp/lib/telemetry';
import type { MvpSurface } from '@/features/mvp/types';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Card, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input, TextArea } from '@/shared/ui/Input';

interface MvpSurfacePageProps {
  surface: MvpSurface['slug'];
}

const surfaceCopy: Record<MvpSurface['slug'], { focus: string[]; nextBuild: string[] }> = {
  'onboarding': {
    focus: [
      'Capture role, goals, obligations, and current planning pain in one sitting.',
      'Preserve enough structure to seed the first weekly review without manual cleanup.',
      'Reach a useful first plan within the first session.',
    ],
    nextBuild: [
      'Replace static prompts with validated form state.',
      'Persist draft progress and completion state.',
      'Emit onboarding lifecycle analytics.',
    ],
  },
  'weekly-review': {
    focus: [
      'Summarize unfinished work, commitments, and constraints.',
      'Generate 3 to 5 priorities with human-editable rationale.',
      'Require explicit confirmation before the week becomes active.',
    ],
    nextBuild: [
      'Store review inputs and generated output together.',
      'Add deterministic AI generation with fallbacks.',
      'Lock and version weekly plans after confirmation.',
    ],
  },
  today: {
    focus: [
      'Show only active priorities and actionable next steps.',
      'Keep updates fast: complete, defer, or add a small note.',
      'Anchor each day to the current weekly plan.',
    ],
    nextBuild: [
      'Hydrate from action items instead of static placeholders.',
      'Add lightweight daily check-in persistence.',
      'Implement carry-forward rules for unfinished work.',
    ],
  },
  reflection: {
    focus: [
      'Capture qualitative signal at the end of the day and week.',
      'Make reflection inputs useful for both the user and product learning.',
      'Keep the prompts short enough to finish consistently.',
    ],
    nextBuild: [
      'Persist daily and weekly reflections separately.',
      'Feed themes into the internal analytics surface.',
      'Connect reflection prompts to weekly plan outcomes.',
    ],
  },
  admin: {
    focus: [
      'Track activation, weekly review completion, retention, and feedback.',
      'Make design-partner friction visible without log diving.',
      'Keep this view internal only.',
    ],
    nextBuild: [
      'Replace placeholder KPIs with tracked events.',
      'Add cohort views for invited users.',
      'Expose qualitative feedback themes for weekly review.',
    ],
  },
};

function parseLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatLines(value: string[]) {
  return value.join('\n');
}

function OnboardingSurface() {
  const onboarding = useMvpStore((state) => state.onboarding);
  const saveOnboarding = useMvpStore((state) => state.saveOnboarding);
  const [displayName, setDisplayName] = useState(onboarding.displayName);
  const [role, setRole] = useState(onboarding.role);
  const [lifeSeason, setLifeSeason] = useState(onboarding.lifeSeason);
  const [planningPain, setPlanningPain] = useState(onboarding.planningPain);
  const [successDefinition, setSuccessDefinition] = useState(onboarding.successDefinition);
  const [goals, setGoals] = useState(formatLines(onboarding.goals));
  const [commitments, setCommitments] = useState(formatLines(onboarding.commitments));
  const [constraints, setConstraints] = useState(formatLines(onboarding.constraints));

  return (
    <Card className="space-y-5">
      <CardHeader>
        <CardTitle>Onboarding intake</CardTitle>
      </CardHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        <Input placeholder="Role" value={role} onChange={(event) => setRole(event.target.value)} />
        <Input placeholder="Life season" value={lifeSeason} onChange={(event) => setLifeSeason(event.target.value)} />
        <Input
          placeholder="Success definition for this season"
          value={successDefinition}
          onChange={(event) => setSuccessDefinition(event.target.value)}
        />
      </div>

      <TextArea
        placeholder="What is breaking in the current planning system?"
        value={planningPain}
        onChange={(event) => setPlanningPain(event.target.value)}
      />
      <TextArea
        placeholder="Goals, one per line"
        value={goals}
        onChange={(event) => setGoals(event.target.value)}
      />
      <TextArea
        placeholder="Recurring commitments, one per line"
        value={commitments}
        onChange={(event) => setCommitments(event.target.value)}
      />
      <TextArea
        placeholder="Constraints or realities, one per line"
        value={constraints}
        onChange={(event) => setConstraints(event.target.value)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() =>
            saveOnboarding({
              displayName,
              role,
              lifeSeason,
              planningPain,
              successDefinition,
              goals: parseLines(goals),
              commitments: parseLines(commitments),
              constraints: parseLines(constraints),
            })
          }
        >
          Save intake
        </Button>
        {onboarding.completedAt ? (
          <span className="text-sm text-emerald-300">Saved. Continue to weekly review when ready.</span>
        ) : (
          <span className="text-sm text-zinc-400">This creates the structured context for the first weekly plan.</span>
        )}
      </div>
    </Card>
  );
}

function WeeklyReviewSurface() {
  const review = useMvpStore((state) => state.review);
  const plan = useMvpStore((state) => state.plan);
  const runWeeklyReview = useMvpStore((state) => state.runWeeklyReview);
  const confirmPlan = useMvpStore((state) => state.confirmPlan);
  const [wins, setWins] = useState(formatLines(review.wins));
  const [unfinishedWork, setUnfinishedWork] = useState(formatLines(review.unfinishedWork));
  const [constraints, setConstraints] = useState(formatLines(review.constraints));
  const [focusArea, setFocusArea] = useState(review.focusArea);
  const [energyLevel, setEnergyLevel] = useState(String(review.energyLevel));
  const [notes, setNotes] = useState(review.notes);

  return (
    <div className="space-y-4">
      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Weekly review draft</CardTitle>
        </CardHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Primary focus area" value={focusArea} onChange={(event) => setFocusArea(event.target.value)} />
          <Input
            placeholder="Energy level 1-5"
            type="number"
            min={1}
            max={5}
            value={energyLevel}
            onChange={(event) => setEnergyLevel(event.target.value)}
          />
        </div>

        <TextArea placeholder="Wins from the previous cycle, one per line" value={wins} onChange={(event) => setWins(event.target.value)} />
        <TextArea
          placeholder="Unfinished work still pulling attention, one per line"
          value={unfinishedWork}
          onChange={(event) => setUnfinishedWork(event.target.value)}
        />
        <TextArea
          placeholder="Constraints for this week, one per line"
          value={constraints}
          onChange={(event) => setConstraints(event.target.value)}
        />
        <TextArea placeholder="Notes that should shape the plan" value={notes} onChange={(event) => setNotes(event.target.value)} />

        <Button
          onClick={() =>
            runWeeklyReview({
              wins: parseLines(wins),
              unfinishedWork: parseLines(unfinishedWork),
              constraints: parseLines(constraints),
              focusArea,
              energyLevel: Number(energyLevel) || 3,
              notes,
            })
          }
        >
          Generate weekly plan
        </Button>
      </Card>

      {plan.generatedAt ? (
        <Card className="space-y-5">
          <CardHeader>
            <CardTitle>Generated weekly plan</CardTitle>
          </CardHeader>

          <div className="rounded-2xl border border-white/8 bg-black/10 p-4 text-sm leading-6 text-zinc-300">{plan.summary}</div>

          <div className="space-y-3">
            {plan.priorities.map((priority) => (
              <div key={priority.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{priority.title}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{priority.actions.length} actions</span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{priority.rationale}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-primary">{priority.successMetric}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => confirmPlan()} disabled={Boolean(plan.confirmedAt)}>
              {plan.confirmedAt ? 'Plan confirmed' : 'Confirm weekly plan'}
            </Button>
            <span className="text-sm text-zinc-400">
              {plan.confirmedAt ? 'The week is now active. Move to Today to execute.' : 'Review the priorities, then lock the week.'}
            </span>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function TodaySurface() {
  const plan = useMvpStore((state) => state.plan);
  const dailyCheckIns = useMvpStore((state) => state.dailyCheckIns);
  const updateActionStatus = useMvpStore((state) => state.updateActionStatus);
  const saveDailyCheckIn = useMvpStore((state) => state.saveDailyCheckIn);
  const today = new Date().toISOString().slice(0, 10);
  const currentCheckIn = dailyCheckIns.find((entry) => entry.date === today);
  const [energy, setEnergy] = useState(String(currentCheckIn?.energy ?? 3));
  const [focus, setFocus] = useState(String(currentCheckIn?.focus ?? 3));
  const [blockers, setBlockers] = useState(currentCheckIn?.blockers ?? '');
  const [note, setNote] = useState(currentCheckIn?.note ?? '');

  const totals = useMemo(() => {
    const totalActions = plan.priorities.reduce((sum, priority) => sum + priority.actions.length, 0);
    const completedActions = plan.priorities.reduce(
      (sum, priority) => sum + priority.actions.filter((action) => action.status === 'done').length,
      0
    );

    return { totalActions, completedActions };
  }, [plan.priorities]);

  if (!plan.confirmedAt) {
    return (
      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Today view locked</CardTitle>
        </CardHeader>
        <p className="text-sm leading-6 text-zinc-300">
          Confirm a weekly plan first. The daily view stays narrow on purpose and only opens once the week has been explicitly committed.
        </p>
        <Button asChild>
          <Link to="/mvp/weekly-review">Return to weekly review</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Daily execution board</CardTitle>
        </CardHeader>

        <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Week progress</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {totals.completedActions} / {totals.totalActions || 0}
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-3">
          {plan.priorities.map((priority) => (
            <div key={priority.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
              <h3 className="text-base font-semibold text-white">{priority.title}</h3>
              <div className="mt-4 space-y-3">
                {priority.actions.map((action) => (
                  <div key={action.id} className="rounded-2xl border border-white/8 bg-zinc-950/60 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-zinc-100">{action.title}</p>
                        <p className="mt-1 text-xs text-zinc-400">{action.details}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{action.status}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => updateActionStatus(priority.id, action.id, { status: 'done' })}>
                        Complete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateActionStatus(priority.id, action.id, { status: 'deferred' })}>
                        Defer
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateActionStatus(priority.id, action.id, { status: 'todo' })}>
                        Reset
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Daily check-in</CardTitle>
        </CardHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <Input type="number" min={1} max={5} value={energy} onChange={(event) => setEnergy(event.target.value)} placeholder="Energy 1-5" />
          <Input type="number" min={1} max={5} value={focus} onChange={(event) => setFocus(event.target.value)} placeholder="Focus 1-5" />
        </div>
        <TextArea placeholder="Blockers" value={blockers} onChange={(event) => setBlockers(event.target.value)} />
        <TextArea placeholder="Execution note" value={note} onChange={(event) => setNote(event.target.value)} />

        <Button
          onClick={() =>
            saveDailyCheckIn({
              date: today,
              energy: Number(energy) || 3,
              focus: Number(focus) || 3,
              blockers,
              note,
            })
          }
        >
          Save daily check-in
        </Button>
      </Card>
    </div>
  );
}

function ReflectionSurface() {
  const reflections = useMvpStore((state) => state.reflections);
  const feedback = useMvpStore((state) => state.feedback);
  const addReflection = useMvpStore((state) => state.addReflection);
  const submitFeedback = useMvpStore((state) => state.submitFeedback);
  const [dailyReflection, setDailyReflection] = useState('');
  const [weeklyReflection, setWeeklyReflection] = useState('');
  const [rating, setRating] = useState('4');
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-4">
      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Reflection capture</CardTitle>
        </CardHeader>

        <TextArea placeholder="Daily reflection" value={dailyReflection} onChange={(event) => setDailyReflection(event.target.value)} />
        <Button onClick={() => { if (dailyReflection.trim()) { addReflection('daily', dailyReflection.trim()); setDailyReflection(''); } }}>
          Save daily reflection
        </Button>

        <TextArea placeholder="Weekly reflection" value={weeklyReflection} onChange={(event) => setWeeklyReflection(event.target.value)} />
        <Button variant="secondary" onClick={() => { if (weeklyReflection.trim()) { addReflection('weekly', weeklyReflection.trim()); setWeeklyReflection(''); } }}>
          Save weekly reflection
        </Button>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Product feedback</CardTitle>
        </CardHeader>

        <Input type="number" min={1} max={5} value={rating} onChange={(event) => setRating(event.target.value)} placeholder="Rating 1-5" />
        <TextArea placeholder="What created clarity or friction?" value={message} onChange={(event) => setMessage(event.target.value)} />
        <Button
          variant="outline"
          onClick={() => {
            if (message.trim()) {
              submitFeedback(Number(rating) || 4, message.trim());
              setMessage('');
            }
          }}
        >
          Submit feedback
        </Button>
      </Card>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Captured signal</CardTitle>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Reflections</p>
            <p className="mt-2 text-2xl font-semibold text-white">{reflections.length}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Feedback entries</p>
            <p className="mt-2 text-2xl font-semibold text-white">{feedback.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AdminSurface() {
  const getAnalytics = useMvpStore((state) => state.getAnalytics);
  const analytics = getAnalytics();
  const events = useMvpStore((state) => state.events);
  const feedback = useMvpStore((state) => state.feedback);
  const resetWorkspace = useMvpStore((state) => state.resetWorkspace);

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Activation</p>
          <p className="mt-3 text-3xl font-semibold text-white">{analytics.onboardingCompleted ? 'Complete' : 'Pending'}</p>
          <p className="mt-2 text-sm text-zinc-400">Did the operator finish onboarding?</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Plan state</p>
          <p className="mt-3 text-3xl font-semibold text-white">{analytics.weeklyPlanConfirmed ? 'Confirmed' : 'Draft'}</p>
          <p className="mt-2 text-sm text-zinc-400">Has the week been explicitly committed?</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Action completion</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {analytics.completedActions}/{analytics.totalActions || 0}
          </p>
          <p className="mt-2 text-sm text-zinc-400">Closed action items in the active plan.</p>
        </Card>
      </section>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Event stream</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {events.length > 0 ? (
            events.slice().reverse().map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 p-3 text-sm text-zinc-300">
                <span>{event.type}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">{new Date(event.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-400">No analytics events captured yet.</p>
          )}
        </div>
      </Card>

      <Card className="space-y-5">
        <CardHeader>
          <CardTitle>Qualitative feedback</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {feedback.length > 0 ? (
            feedback.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-100">Rating {entry.rating}/5</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{entry.message}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-400">No feedback entries yet.</p>
          )}
        </div>

        <Button variant="destructive" onClick={() => resetWorkspace()}>
          Reset MVP workspace
        </Button>
      </Card>
    </div>
  );
}

export function MvpSurfacePage({ surface }: MvpSurfacePageProps) {
  const hydrateWorkspace = useMvpStore((state) => state.hydrateWorkspace);
  const isHydrating = useMvpStore((state) => state.isHydrating);
  const error = useMvpStore((state) => state.error);
  const mvpSurfaces = useMemo(() => getMvpSurfaces(true), []);
  const currentIndex = mvpSurfaces.findIndex((item) => item.slug === surface);
  const current = mvpSurfaces[currentIndex];
  const previous = currentIndex > 0 ? mvpSurfaces[currentIndex - 1] : null;
  const next = currentIndex < mvpSurfaces.length - 1 ? mvpSurfaces[currentIndex + 1] : null;
  const copy = surfaceCopy[surface];
  const getAnalytics = useMvpStore((state) => state.getAnalytics);
  const analytics = getAnalytics();

  useEffect(() => {
    void hydrateWorkspace();
  }, [hydrateWorkspace]);

  useEffect(() => {
    trackMvpSurfaceViewed(surface);
  }, [surface]);

  const activeSummary = {
    onboarding: analytics.onboardingCompleted ? 'Saved' : 'Pending',
    'weekly-review': analytics.weeklyPlanConfirmed ? 'Confirmed' : analytics.eventCounts.weekly_plan_generated > 0 ? 'Generated' : 'Pending',
    today: analytics.totalActions > 0 ? `${analytics.completedActions}/${analytics.totalActions} done` : 'Pending',
    reflection: analytics.reflections > 0 ? `${analytics.reflections} saved` : 'Pending',
    admin: `${analytics.feedbackEntries} feedback`,
  } satisfies Record<MvpSurface['slug'], string>;

  const content = {
    onboarding: <OnboardingSurface />,
    'weekly-review': <WeeklyReviewSurface />,
    today: <TodaySurface />,
    reflection: <ReflectionSurface />,
    admin: <AdminSurface />,
  } satisfies Record<MvpSurface['slug'], JSX.Element>;

  return (
    <div className="space-y-8">
      {isHydrating ? (
        <Card className="p-4 text-sm text-zinc-300">Syncing MVP workspace…</Card>
      ) : null}
      {error ? (
        <Card className="p-4 text-sm text-rose-300">Workspace sync failed: {error}</Card>
      ) : null}
      <PageTitle
        title={current.title}
        subtitle={current.description}
        action={
          <Button asChild variant="outline">
            <Link to="/mvp">Back to MVP home</Link>
          </Button>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {content[surface]}

        <Card className="space-y-5">
          <CardHeader>
            <CardTitle>{current.phase} focus</CardTitle>
          </CardHeader>

          <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Current loop state</p>
            <p className="mt-2 text-xl font-semibold text-white">{activeSummary[surface]}</p>
          </div>

          <div className="space-y-3">
            {copy.focus.map((item) => (
              <div key={item} className="rounded-2xl border border-white/6 bg-black/10 p-4 text-sm leading-6 text-zinc-200">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <CardHeader>
            <CardTitle>Next build steps</CardTitle>
          </CardHeader>

          <ul className="space-y-3 text-sm text-zinc-300">
            {copy.nextBuild.map((item) => (
              <li key={item} className="rounded-2xl border border-white/6 bg-black/10 p-4">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {previous ? (
          <Button asChild variant="ghost" className="justify-between">
            <Link to={previous.path}>
              <span className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {previous.title}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">{previous.phase}</span>
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {next ? (
          <Button asChild variant="ghost" className="justify-between">
            <Link to={next.path}>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">{next.phase}</span>
              <span className="flex items-center gap-2">
                {next.title}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
        ) : null}
      </section>
    </div>
  );
}
