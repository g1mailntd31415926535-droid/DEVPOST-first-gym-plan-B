import { describe, expect, it } from 'vitest';
import { SEED_EXERCISES } from '../data/seed';
import {
  currentExercise,
  initialSessionState,
  sessionReducer,
  type SessionAction,
  type SessionState,
} from './session';

const TEST_PLAN = [
  'Incline Barbell Press',
  'Flat Bench Press',
  'Lateral Raise',
  'Lat Pulldown',
  'Squat',
].map((name) => {
  const found = SEED_EXERCISES.find((exercise) => exercise.name === name);
  if (!found) throw new Error(`Missing seed exercise: ${name}`);
  return found;
});

const NOW = 1_750_000_000_000;
const reduce = (...actions: SessionAction[]) => actions.reduce(sessionReducer, startState());

function startState(): SessionState {
  return sessionReducer(initialSessionState, { type: 'START', plan: TEST_PLAN });
}

describe('session — set and rest flow', () => {
  it('starts a session at the first exercise with the full queue', () => {
    const state = startState();
    expect(state.phase).toBe('check');
    expect(state.queue).toEqual([0, 1, 2, 3, 4]);
    expect(currentExercise(state)?.name).toBe('Incline Barbell Press');
  });

  it('opens rest after a set with an absolute deadline from default_rest_seconds', () => {
    const state = reduce({ type: 'SET_DONE', now: NOW });
    expect(state.phase).toBe('rest');
    expect(state.currentSet).toBe(1);
    expect(state.finishedSets).toBe(1);
    expect(state.restEndsAt).toBe(NOW + 180_000);
    expect(state.restTarget).toBe('next-set');
  });

  it('advances to the next set when rest ends', () => {
    const state = reduce({ type: 'SET_DONE', now: NOW }, { type: 'REST_DONE' });
    expect(state.phase).toBe('training');
    expect(state.currentSet).toBe(2);
    expect(state.restEndsAt).toBeNull();
  });

  it('moves to the next exercise after the last set + rest, resetting the set counter', () => {
    const state = reduce(
      { type: 'SET_DONE', now: NOW },
      { type: 'REST_DONE' },
      { type: 'SET_DONE', now: NOW },
      { type: 'REST_DONE' },
      { type: 'SET_DONE', now: NOW },
      { type: 'REST_DONE' },
      { type: 'SET_DONE', now: NOW },
    );
    expect(state.restTarget).toBe('next-exercise');

    const afterRest = sessionReducer(state, { type: 'REST_DONE' });
    expect(afterRest.phase).toBe('check');
    expect(afterRest.queue).toEqual([1, 2, 3, 4]);
    expect(afterRest.currentSet).toBe(1);
    expect(currentExercise(afterRest)?.name).toBe('Flat Bench Press');
    expect(afterRest.finishedSets).toBe(4);
  });

  it('ignores REST_DONE when no rest is running', () => {
    const state = startState();
    expect(sessionReducer(state, { type: 'REST_DONE' })).toBe(state);
  });
});

describe('session — deferring a busy exercise', () => {
  it('sends the busy exercise to the end of the queue and keeps it in the plan', () => {
    const state = reduce({ type: 'DEFER' });
    expect(state.phase).toBe('check');
    expect(state.queue).toEqual([1, 2, 3, 4, 0]);
    expect(state.deferred).toEqual([0]);
    expect(state.plan).toHaveLength(5);
    expect(currentExercise(state)?.name).toBe('Flat Bench Press');
    expect(state.plan[0].name).toBe('Incline Barbell Press');
  });

  it('asks again when the deferred exercise comes back around', () => {
    let state = reduce({ type: 'DEFER' });
    for (let index = 0; index < 4; index += 1) {
      const exercise = currentExercise(state)!;
      for (let set = 0; set < exercise.defaultSets; set += 1) {
        state = sessionReducer(state, { type: 'SET_DONE', now: NOW });
        state = sessionReducer(state, { type: 'REST_DONE' });
      }
    }
    expect(state.phase).toBe('check');
    expect(currentExercise(state)?.name).toBe('Incline Barbell Press');
    expect(state.deferred).toEqual([0]);
  });

  it('keeps the exercise current if it is the only one left', () => {
    const single = sessionReducer(initialSessionState, {
      type: 'START',
      plan: [TEST_PLAN[0]],
    });
    const deferred = sessionReducer(single, { type: 'DEFER' });
    expect(deferred.queue).toEqual([0]);
    expect(currentExercise(deferred)?.name).toBe('Incline Barbell Press');
    expect(deferred.deferred).toEqual([0]);
  });
});

describe('session — swapping and finishing', () => {
  it('replaces the current plan slot and remembers the original name', () => {
    const replacement = SEED_EXERCISES.find(
      (exercise) => exercise.name === 'Incline Dumbbell Press',
    )!;
    const state = reduce({ type: 'CHOOSE', exercise: replacement });
    expect(state.phase).toBe('training');
    expect(currentExercise(state)?.name).toBe('Incline Dumbbell Press');
    expect(state.replacedFrom[0]).toBe('Incline Barbell Press');
    expect(state.plan[0].name).toBe('Incline Dumbbell Press');
  });

  it('finishes only after the last set of the last exercise', () => {
    let state = startState();
    let guard = 0;
    while (state.phase !== 'finished' && guard < 200) {
      guard += 1;
      if (state.phase === 'check') {
        state = sessionReducer(state, { type: 'START_EXERCISE' });
      } else if (state.phase === 'training') {
        state = sessionReducer(state, { type: 'SET_DONE', now: NOW });
      } else if (state.phase === 'rest') {
        state = sessionReducer(state, { type: 'REST_DONE' });
      } else {
        throw new Error(`Unexpected phase: ${state.phase}`);
      }
    }
    expect(state.phase).toBe('finished');
    expect(state.queue).toEqual([]);
    expect(state.finishedSets).toBe(
      TEST_PLAN.reduce((total, exercise) => total + exercise.defaultSets, 0),
    );
  });
});
