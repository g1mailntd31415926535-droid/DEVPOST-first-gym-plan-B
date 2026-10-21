import type { Exercise } from '../types';

export type SessionPhase =
  | 'home'
  | 'check'
  | 'busy'
  | 'alternatives'
  | 'training'
  | 'rest'
  | 'finished';

export type RestTarget = 'next-set' | 'next-exercise';

export interface SessionState {
  phase: SessionPhase;
  plan: Exercise[];
  /** Slot indices still to train; queue[0] is the current exercise. */
  queue: number[];
  currentSet: number;
  finishedSets: number;
  /** Slot index -> original exercise name, for slots that were swapped. */
  replacedFrom: Record<number, string>;
  /** Slots the user sent to the back of the queue because the machine was busy. */
  deferred: number[];
  showAll: boolean;
  restEndsAt: number | null;
  restTarget: RestTarget | null;
}

export type SessionAction =
  | { type: 'START'; plan: Exercise[] }
  | { type: 'START_EXERCISE' }
  | { type: 'OPEN_BUSY' }
  | { type: 'OPEN_ALTERNATIVES' }
  | { type: 'BACK_TO_CHECK' }
  | { type: 'BACK_TO_BUSY' }
  | { type: 'CHOOSE'; exercise: Exercise }
  | { type: 'TOGGLE_SHOW_ALL' }
  | { type: 'SET_DONE'; now: number }
  | { type: 'REST_DONE' }
  | { type: 'DEFER' }
  | { type: 'RESTART' };

export const initialSessionState: SessionState = {
  phase: 'home',
  plan: [],
  queue: [],
  currentSet: 1,
  finishedSets: 0,
  replacedFrom: {},
  deferred: [],
  showAll: false,
  restEndsAt: null,
  restTarget: null,
};

export function currentSlot(state: SessionState): number | undefined {
  return state.queue[0];
}

export function currentExercise(state: SessionState): Exercise | undefined {
  const slot = currentSlot(state);
  return slot === undefined ? undefined : state.plan[slot];
}

/** Exercises still waiting after the current one, in queue order. */
export function upcomingExercises(state: SessionState): Exercise[] {
  return state.queue.slice(1).map((slot) => state.plan[slot]);
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START':
      return {
        ...initialSessionState,
        phase: 'check',
        plan: action.plan,
        queue: action.plan.map((_, index) => index),
      };

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
      const slot = currentSlot(state);
      if (slot === undefined) return state;
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
      const exercise = currentExercise(state);
      if (!exercise) return state;
      const isLastSet = state.currentSet >= exercise.defaultSets;
      return {
        ...state,
        phase: 'rest',
        finishedSets: state.finishedSets + 1,
        // Absolute deadline, so a backgrounded tab still shows the right time.
        restEndsAt: action.now + exercise.defaultRestSeconds * 1000,
        restTarget: isLastSet ? 'next-exercise' : 'next-set',
      };
    }

    case 'REST_DONE': {
      if (state.phase !== 'rest') return state;

      if (state.restTarget === 'next-set') {
        return {
          ...state,
          phase: 'training',
          currentSet: state.currentSet + 1,
          restEndsAt: null,
          restTarget: null,
        };
      }

      const queue = state.queue.slice(1);
      if (queue.length === 0) {
        return { ...state, phase: 'finished', queue, restEndsAt: null, restTarget: null };
      }
      return {
        ...state,
        phase: 'check',
        queue,
        currentSet: 1,
        restEndsAt: null,
        restTarget: null,
      };
    }

    case 'DEFER': {
      const slot = currentSlot(state);
      if (slot === undefined) return state;
      const rest = state.queue.slice(1);
      return {
        ...state,
        // The busy exercise stays in the plan and comes back at the end of the queue.
        queue: rest.length > 0 ? [...rest, slot] : state.queue,
        deferred: state.deferred.includes(slot) ? state.deferred : [...state.deferred, slot],
        phase: 'check',
        currentSet: 1,
        showAll: false,
      };
    }

    case 'RESTART':
      return { ...initialSessionState };

    default:
      return state;
  }
}
