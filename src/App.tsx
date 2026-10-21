import { useMemo, useReducer } from 'react';
import { SEED_EXERCISES } from './data/seed';
import { buildTestPlan } from './data/exercises';
import { rankAlternatives } from './lib/recommendation';
import type { Exercise, Phase } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { CheckScreen } from './screens/CheckScreen';
import { BusyChoiceScreen } from './screens/BusyChoiceScreen';
import { ReplacementListScreen } from './screens/ReplacementListScreen';
import { TrainingScreen } from './screens/TrainingScreen';
import { FinishedScreen } from './screens/FinishedScreen';

interface AppState {
  phase: Phase;
  plan: Exercise[];
  currentIndex: number;
  currentSet: number;
  finishedSets: number;
  /** Slot index -> original exercise name, for slots that were swapped. */
  replacedFrom: Record<number, string>;
  showAll: boolean;
}

type Action =
  | { type: 'START'; plan: Exercise[] }
  | { type: 'START_EXERCISE' }
  | { type: 'OPEN_BUSY' }
  | { type: 'OPEN_ALTERNATIVES' }
  | { type: 'BACK_TO_CHECK' }
  | { type: 'BACK_TO_BUSY' }
  | { type: 'CHOOSE'; exercise: Exercise }
  | { type: 'TOGGLE_SHOW_ALL' }
  | { type: 'SET_DONE' }
  | { type: 'RESTART' };

const initialState: AppState = {
  phase: 'home',
  plan: [],
  currentIndex: 0,
  currentSet: 1,
  finishedSets: 0,
  replacedFrom: {},
  showAll: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START':
      return { ...initialState, phase: 'check', plan: action.plan };

    case 'START_EXERCISE':
      return { ...state, phase: 'training', currentSet: 1 };

    case 'OPEN_BUSY':
      return { ...state, phase: 'busy' };

    case 'OPEN_ALTERNATIVES':
      return { ...state, phase: 'alternatives', showAll: false };

    case 'BACK_TO_CHECK':
      return { ...state, phase: 'check' };

    case 'BACK_TO_BUSY':
      return { ...state, phase: 'busy' };

    case 'CHOOSE': {
      const slot = state.currentIndex;
      return {
        ...state,
        plan: state.plan.map((exercise, index) => (index === slot ? action.exercise : exercise)),
        replacedFrom: { ...state.replacedFrom, [slot]: state.plan[slot].name },
        phase: 'training',
        currentSet: 1,
        showAll: false,
      };
    }

    case 'TOGGLE_SHOW_ALL':
      return { ...state, showAll: !state.showAll };

    case 'SET_DONE': {
      const current = state.plan[state.currentIndex];
      const finishedSets = state.finishedSets + 1;

      if (state.currentSet < current.defaultSets) {
        return { ...state, currentSet: state.currentSet + 1, finishedSets };
      }

      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.plan.length) {
        return { ...state, phase: 'finished', finishedSets };
      }

      return { ...state, currentIndex: nextIndex, currentSet: 1, finishedSets, phase: 'check' };
    }

    case 'RESTART':
      return { ...initialState };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const testPlan = useMemo(() => buildTestPlan(SEED_EXERCISES), []);
  const current = state.plan[state.currentIndex];

  const ranked = useMemo(
    () => (current ? rankAlternatives(current, SEED_EXERCISES) : []),
    [current],
  );

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
        index={state.currentIndex}
        total={state.plan.length}
        onTrain={() => dispatch({ type: 'START_EXERCISE' })}
        onBusy={() => dispatch({ type: 'OPEN_BUSY' })}
      />
    );
  }

  if (state.phase === 'busy') {
    return (
      <BusyChoiceScreen
        onPickSuggested={() => dispatch({ type: 'OPEN_ALTERNATIVES' })}
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

  return (
    <TrainingScreen
      exercise={current}
      plan={state.plan}
      currentIndex={state.currentIndex}
      currentSet={state.currentSet}
      replacedFrom={state.replacedFrom[state.currentIndex]}
      onSetDone={() => dispatch({ type: 'SET_DONE' })}
    />
  );
}
