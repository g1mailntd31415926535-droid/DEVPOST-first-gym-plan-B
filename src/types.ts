export type MuscleGroup = 'Chest' | 'Shoulders' | 'Back' | 'Legs' | 'Arms' | 'Core';

export type MovementFamily = 'Press' | 'Pull' | 'Squat' | 'Hinge' | 'Raise';

export type ExerciseType = 'compound' | 'isolation';

export type ClassifyStatus = 'classified' | 'needs-review';

export interface Exercise {
  id: string;
  name: string;
  defaultSets: number;
  defaultMinRep: number;
  defaultMaxRep: number;
  defaultRestSeconds: number;
  equipment: string | null;
  muscleGroup: MuscleGroup;
  targetRegion: string;
  movementFamily: MovementFamily;
  movementPattern: string;
  exerciseType: ExerciseType;
  classifyStatus: ClassifyStatus;
  imageAsset: string | null;
}

export interface RankedExercise {
  exercise: Exercise;
  score: number;
  movementScore: number;
  typeScore: number;
  /** Different movement family: must be shown with its own tag, never as "Recommend". */
  isDifferentStyle: boolean;
  /** Only the single best same-movement candidate gets this tag. */
  recommended: boolean;
}
