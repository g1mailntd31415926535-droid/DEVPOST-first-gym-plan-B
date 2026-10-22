import type { MuscleGroup as MuscleMapGroup, MuscleMapView } from '@musclemap/core';
import type { MuscleGroup } from '../types';

export interface RegionHighlight {
  /** MuscleMap group whose path(s) get the red fill. */
  group: MuscleMapGroup;
  /** Which body view shows the target best. */
  view: MuscleMapView;
  /**
   * True only when MuscleMap has a real path for this exact region.
   * Chest has no upper/middle split, so it is highlighted at group level and
   * the UI must show the text label instead of pretending to be precise.
   */
  exact: boolean;
  /** Human label shown next to the figure. */
  label: string;
}

const SHOULDER_REGIONS: Record<string, Pick<RegionHighlight, 'group' | 'exact' | 'label'>> = {
  Front: { group: 'SHOULDERS_FRONT', exact: true, label: 'Front delts' },
  Side: { group: 'SHOULDERS_SIDE', exact: true, label: 'Side delts' },
  Rear: { group: 'SHOULDERS_REAR', exact: true, label: 'Rear delts' },
};

/**
 * Taxonomy -> MuscleMap mapping. Verified against MUSCLE_GROUP_PARTS of
 * @musclemap/assets 1.1.0: CHEST, LATS, QUADS and SHOULDERS_FRONT/SIDE/REAR
 * exist; there is no UPPER/LOWER chest path. Unknown groups fall back to the
 * whole muscle group with an explicit label rather than guessing a region.
 */
export function regionHighlight(muscleGroup: MuscleGroup, targetRegion: string): RegionHighlight {
  switch (muscleGroup) {
    case 'Chest':
      return {
        group: 'CHEST',
        view: 'FRONT',
        exact: false,
        label: `${targetRegion} chest`,
      };
    case 'Shoulders': {
      const shoulder = SHOULDER_REGIONS[targetRegion] ?? {
        group: 'SHOULDERS_SIDE' as const,
        exact: false,
        label: 'Shoulders',
      };
      return { ...shoulder, view: 'FRONT' };
    }
    case 'Back':
      return {
        group: 'LATS',
        view: 'BACK',
        exact: targetRegion === 'Lats',
        label: targetRegion === 'Lats' ? 'Lats' : `Back · ${targetRegion}`,
      };
    case 'Legs':
      return {
        group: 'QUADS',
        view: 'FRONT',
        exact: targetRegion === 'Quads',
        label: targetRegion === 'Quads' ? 'Quads' : `Legs · ${targetRegion}`,
      };
    case 'Arms':
      return {
        group: 'BICEPS',
        view: 'FRONT',
        exact: false,
        label: `Arms · ${targetRegion}`,
      };
    case 'Core':
      return {
        group: 'CORE',
        view: 'FRONT',
        exact: false,
        label: `Core · ${targetRegion}`,
      };
    default:
      return {
        group: 'CHEST',
        view: 'FRONT',
        exact: false,
        label: `${muscleGroup} · ${targetRegion}`,
      };
  }
}
