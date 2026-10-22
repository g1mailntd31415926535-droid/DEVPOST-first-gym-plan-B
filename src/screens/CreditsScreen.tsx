import { ArrowLeftIcon } from '../components/icons';

const REPDB_URL = 'https://repdb.co/';
const REPDB_DATASET_URL = 'https://github.com/RepDB/exercise-dataset';
const MUSCLEMAP_URL = 'https://github.com/Jsplice/MuscleMap';

export function CreditsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="phone-frame flex flex-col bg-[#E9ECF2]">
      <header className="flex items-center gap-3 px-5 pb-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/5"
        >
          <ArrowLeftIcon />
        </button>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Credits</p>
          <h1 className="text-[18px] font-extrabold leading-tight">Data &amp; assets</h1>
        </div>
      </header>

      <div className="space-y-3 px-5 pb-8">
        <section className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">Exercise illustrations</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Exercise data and flat illustrations by{' '}
            <a
              href={REPDB_URL}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand underline decoration-brand/30 underline-offset-2"
            >
              RepDB (repdb.co)
            </a>
            . Free-tier images are used inside this demo with the required attribution; only the images
            needed for the Test Set and its candidates are bundled, not the dataset itself.
          </p>
          <a
            href={REPDB_DATASET_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[11px] font-bold text-brand underline decoration-brand/30 underline-offset-2"
          >
            RepDB Free Exercise Dataset
          </a>
        </section>

        <section className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">Muscle highlighting</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            The red body figure is rendered with{' '}
            <a
              href={MUSCLEMAP_URL}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand underline decoration-brand/30 underline-offset-2"
            >
              MuscleMap
            </a>{' '}
            (MIT). Shoulders, lats and quads use dedicated region paths. MuscleMap 1.1 has no upper or
            middle chest path, so Gym Plan B layers an <strong>approximate</strong> gradient mask over the
            whole chest and labels it &ldquo;approx.&rdquo; — visual emphasis, not an anatomical boundary
            from the library.
          </p>
        </section>

        <section className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">Exercise catalog</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            This demo reuses the exercise catalog from the author&rsquo;s earlier Gym Tracker project.
            Only the rows needed for the Test Set and its candidates were copied into a separate,
            read-only Supabase project, keeping the original exercise UUIDs and defaults. No user,
            account, auth or credential data was copied, and the old project is never modified.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Exercise classifications are hand-curated for this proof of concept. Anything uncertain is
            kept out of swap results instead of being presented as a recommendation.
          </p>
        </section>

        <section className="rounded-card bg-white p-4 ring-1 ring-ink/5">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide">Not medical advice</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Gym Plan B is a proof-of-concept demo. Ranking is a rule of thumb for movement similarity,
            not a scientific claim about training effect.
          </p>
        </section>
      </div>
    </div>
  );
}
