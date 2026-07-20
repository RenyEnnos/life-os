import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Circle, LoaderCircle } from 'lucide-react';

import { useMvpStore } from '@/features/mvp/store/useMvpStore';
import type { MvpAnalyticsSnapshot, MvpOnboardingDraft, MvpPlan } from '@/features/mvp/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

const loopSteps = ['Onboarding', 'Weekly review', 'Today', 'Reflection'] as const;

function getNextStep(
  onboarding: MvpOnboardingDraft,
  plan: MvpPlan,
  analytics: MvpAnalyticsSnapshot
) {
  if (!onboarding.completedAt) {
    return {
      stepIndex: 0,
      status: 'Set your foundation',
      title: 'Start with what this week needs',
      description: 'Capture your goals, commitments, and constraints once so the plan can stay realistic.',
      action: 'Start with your context',
      path: '/mvp/onboarding',
    };
  }

  if (!plan.generatedAt) {
    return {
      stepIndex: 1,
      status: 'Shape the week',
      title: 'Turn your context into a focused plan',
      description: 'Review what is unfinished, name the main focus, and create a small set of priorities.',
      action: 'Plan your week',
      path: '/mvp/weekly-review',
    };
  }

  if (!plan.confirmedAt) {
    return {
      stepIndex: 1,
      status: 'Your plan is ready',
      title: 'Make sure the week feels achievable',
      description: 'Review the suggested priorities and confirm them before daily execution begins.',
      action: 'Review your weekly plan',
      path: '/mvp/weekly-review',
    };
  }

  if (analytics.totalActions > 0 && analytics.completedActions >= analytics.totalActions) {
    return {
      stepIndex: 3,
      status: 'Close the loop',
      title: 'Notice what worked before moving on',
      description: 'Capture the useful signal from this week so the next plan starts with better context.',
      action: 'Reflect on your week',
      path: '/mvp/reflection',
    };
  }

  return {
    stepIndex: 2,
    status: 'Your week is active',
    title: 'Keep today deliberately small',
    description: 'Work from the confirmed priorities, update the next action, and record any blocker.',
    action: 'Continue with today',
    path: '/mvp/today',
  };
}

export function MvpWorkspacePage() {
  const [initialHydrationComplete, setInitialHydrationComplete] = useState(false);
  const onboarding = useMvpStore((state) => state.onboarding);
  const plan = useMvpStore((state) => state.plan);
  const analytics = useMvpStore((state) => state.analytics);
  const isHydrating = useMvpStore((state) => state.isHydrating);
  const error = useMvpStore((state) => state.error);
  const hydrateWorkspace = useMvpStore((state) => state.hydrateWorkspace);
  const nextStep = getNextStep(onboarding, plan, analytics);

  useEffect(() => {
    let active = true;
    void Promise.resolve(hydrateWorkspace()).finally(() => {
      if (active) setInitialHydrationComplete(true);
    });

    return () => {
      active = false;
    };
  }, [hydrateWorkspace]);

  if (!initialHydrationComplete || isHydrating) {
    return (
      <Card className="flex min-h-64 items-center justify-center gap-3 text-sm text-zinc-300">
        <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        Preparing your weekly workspace…
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl space-y-4">
        <p className="text-sm font-medium text-rose-300">Your weekly workspace could not be loaded.</p>
        <p className="text-sm leading-6 text-zinc-400">Check the connection and try again. Your saved workspace has not been changed.</p>
        <Button onClick={() => void hydrateWorkspace(true)}>Try again</Button>
      </Card>
    );
  }

  return (
    <main className="space-y-6 md:pb-8">
      <header className="max-w-3xl space-y-2">
        <p className="text-sm font-medium text-primary">Your weekly loop</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">A clear week starts with one next step.</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          LifeOS turns your current context into a focused plan, keeps today small, and closes the week with reflection.
        </p>
      </header>

      <Card className="grid gap-8 border-white/10 bg-zinc-900/50 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{nextStep.status}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{nextStep.title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{nextStep.description}</p>
        </div>

        <Button asChild size="lg" className="h-12 w-full justify-between px-5 transition-transform duration-150 active:scale-[0.98]">
          <Link to={nextStep.path} data-testid="primary-next-step">
            {nextStep.action}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </Card>

      <section aria-labelledby="loop-progress-title" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="loop-progress-title" className="text-lg font-semibold text-white">This week</h2>
            <p className="mt-1 text-sm text-zinc-400">Follow the loop in order. LifeOS keeps the next step visible.</p>
          </div>
          {analytics.totalActions > 0 ? (
            <p className="text-sm tabular-nums text-zinc-300">
              {analytics.completedActions} of {analytics.totalActions} actions complete
            </p>
          ) : null}
        </div>

        <ol className="grid gap-2 sm:grid-cols-4">
          {loopSteps.map((step, index) => {
            const complete = index < nextStep.stepIndex;
            const current = index === nextStep.stepIndex;

            return (
              <li
                key={step}
                aria-current={current ? 'step' : undefined}
                className={`flex min-h-20 items-center gap-3 rounded-2xl border px-4 py-3 ${
                  current
                    ? 'border-primary/50 bg-primary/10 text-white'
                    : complete
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-zinc-200'
                      : 'border-white/8 bg-black/10 text-zinc-500'
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/30">
                  {complete ? <Check className="h-4 w-4" aria-hidden="true" /> : <Circle className="h-3 w-3" aria-hidden="true" />}
                </span>
                <span>
                  <span className="block text-sm font-medium">{step}</span>
                  <span className="mt-0.5 block text-xs text-current/70">{current ? 'Now' : complete ? 'Complete' : 'Ahead'}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
