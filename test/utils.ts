import test from 'ava';
import * as beautify from 'simply-beautiful';

import * as npf from '../src';
import npf2html from '../src';

/**
 * Declares a test with the given {@link description} that runs
 * `npf2html(blocks, options)` and snapshots the result for testing.
 */
export function snapshotNpf2Html(
  description: string,
  blocks: npf.ContentBlock[],
  options?: npf.Options
): void {
  test(description, t => t.snapshot(beautify.html(npf2html(blocks, options))));
}
