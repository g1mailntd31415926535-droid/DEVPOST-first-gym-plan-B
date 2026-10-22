import { describe, expect, it } from 'vitest';
import { regionHighlight } from './muscleMapMapping';

describe('regionHighlight', () => {
  it('maps the five Test Set regions', () => {
    expect(regionHighlight('Chest', 'Upper')).toMatchObject({
      group: 'CHEST',
      view: 'FRONT',
      exact: false,
      approximate: true,
      label: 'Upper chest (approx.)',
    });
    expect(regionHighlight('Chest', 'Middle')).toMatchObject({ group: 'CHEST', exact: false });
    expect(regionHighlight('Shoulders', 'Side')).toMatchObject({
      group: 'SHOULDERS_SIDE',
      exact: true,
      label: 'Side delts',
    });
    expect(regionHighlight('Back', 'Lats')).toMatchObject({
      group: 'LATS',
      view: 'BACK',
      exact: true,
    });
    expect(regionHighlight('Legs', 'Quads')).toMatchObject({
      group: 'QUADS',
      view: 'FRONT',
      exact: true,
    });
  });

  it('never claims an exact chest sub-region', () => {
    for (const region of ['Upper', 'Middle', 'Lower']) {
      expect(regionHighlight('Chest', region).exact).toBe(false);
      expect(regionHighlight('Chest', region).approximate).toBe(true);
    }
  });

  it('falls back to a whole-group label for unsupported regions', () => {
    expect(regionHighlight('Back', 'Upper')).toMatchObject({
      group: 'LATS',
      exact: false,
      label: 'Back · Upper',
    });
    expect(regionHighlight('Arms', 'Biceps')).toMatchObject({ group: 'BICEPS', exact: false });
  });
});
