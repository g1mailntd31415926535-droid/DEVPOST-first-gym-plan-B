import { useMemo, useReducer } from 'react';
import { SEED_EXERCISES } from './data/seed';
import { buildTestPlan } from './data/exercises';
import { rankAlternatives } from './lib/recommendation';
import {
  currentExercise,
  initialSessionState,
  sessionReducer,
  upcomingExercises,
} from './lib/session';
import { HomeScreen } from './screens/HomeScreen';
import { CheckScreen } from './screens/CheckScreen';
import { BusyChoiceScreen } from './screens/BusyChoiceScreen';
import { ReplacementListScreen } from './screens/ReplacementListScreen';
import { TrainingScreen } from './screens/TrainingScreen';
import { RestScreen } from './screens/RestScreen';
import { FinishedScreen } from './screens/FinishedScreen';

export default function App() {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  const testPlan = useMemo(() => buildTestPlan(SEED_EXERCISES), []);
  const current = currentExercise(state);

  const ranked = useMemo(
    () => (current ? rankAlternatives(current, SEED_EXERCISES) : []),
    [current],
  );

  const upcoming = upcomingExercises(state);
  const position = state.plan.length - state.queue.length + 1;

  if (state.phase === 'home') {
    return <HomeScreen onStart={() => dispatch({ type: 'START', plan: testPlan })} />;
  }

  if (state.phase === 'finished') {
    return (
      <FinishedScreen
        finishedSets={state.finishedSets}
        totalExercises={state.plan.length}
        onRestart={() => dispatch({ type: 'RESTART' })}
      />
    );
  }

  if (!current) return null;

  if (state.phase === 'check') {
    return (
      <CheckScreen
        exercise={current}
        index={position}
        total={state.plan.length}
        isDeferred={state.deferred.includes(state.queue[0])}
        onTrain={() => dispatch({ type: 'START_EXERCISE' })}
        onBusy={() => dispatch({ type: 'OPEN_BUSY' })}
      />
    );
  }

  if (state.phase === 'busy') {
    return (
      <BusyChoiceScreen
        exerciseName={current.name}
        onPickSuggested={() => dispatch({ type: 'OPEN_ALTERNATIVES' })}
        onDefer={() => dispatch({ type: 'DEFER' })}
        onBack={() => dispatch({ type: 'BACK_TO_CHECK' })}
      />
    );
  }

  if (state.phase === 'alternatives') {
    return (
      <ReplacementListScreen
        base={current}
        ranked={ranked}
        showAll={state.showAll}
        onToggleShowAll={() => dispatch({ type: 'TOGGLE_SHOW_ALL' })}
        onChoose={(exercise) => dispatch({ type: 'CHOOSE', exercise })}
        onBack={() => dispatch({ type: 'BACK_TO_BUSY' })}
      />
    );
  }

  if (state.phase === 'rest' && state.restEndsAt !== null) {
    const nextLabel =
      state.restTarget === 'next-set'
        ? `Set ${state.currentSet + 1} of ${current.defaultSets}`
        : (upcoming[0]?.name ?? 'Session complete');

    return (
      <RestScreen
        exercise={current}
        restEndsAt={state.restEndsAt}
        totalSeconds={current.defaultRestSeconds}
        nextLabel={nextLabel}
        onDone={() => dispatch({ type: 'REST_DONE' })}
      />
    );
  }

  return (
    <TrainingScreen
      exercise={current}
      position={position}
      total={state.plan.length}
      upcoming={upcoming}
      currentSet={state.currentSet}
      replacedFrom={state.replacedFrom[state.queue[0]]}
      onSetDone={() => dispatch({ type: 'SET_DONE', now: Date.now() })}
    />
  );
}
