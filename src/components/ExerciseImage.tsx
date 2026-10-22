import { useState } from 'react';
import type { Exercise } from '../types';
import { DumbbellIcon } from './icons';

/**
 * Bundled RepDB illustration. If an exercise has no image (or the file is
 * missing) we keep the card layout stable with a neutral placeholder instead
 * of showing a broken image.
 */
export function ExerciseImage({
  exercise,
  className = 'h-16 w-16',
}: {
  exercise: Exercise;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !exercise.imageAsset || failed;

  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F4F1E8] ring-1 ring-ink/5',
        className,
      ].join(' ')}
    >
      {showFallback ? (
        <DumbbellIcon className="h-6 w-6 text-brand/60" />
      ) : (
        <img
          src={exercise.imageAsset ?? ''}
          alt={`${exercise.name} illustration`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
