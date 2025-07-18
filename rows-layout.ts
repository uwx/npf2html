import {Renderer} from './renderer.js';

/**
 * Content blocks organized in rows, with variable elements per row.
 *
 * @see https://www.tumblr.com/docs/npf#layout-block-type-rows
 *
 * @category Layout
 */
export interface RowsLayout {
  type: 'rows';

  /** A list of ways to display sets of rows. */
  display: RowsDisplay[];

  /** How the content should be truncated. */
  truncateAfter?: number;
}

/**
 * An object describing how to display a single row.
 *
 * @category Layout
 */
export interface RowsDisplay {
  /** An array of block indices to use in this row. */
  blocks: number[];

  /**
   * The display mode for this row.
   *
   * @see https://www.tumblr.com/docs/npf#layout-block-display-mode-carousel
   */
  mode?: {type: 'carousel'};
}

/**
 * Wraps {@link html} as single row.
 *
 * @category Layout
 */
export function renderRowLayout(
  renderer: Renderer,
  display: RowsDisplay,
  html: string
): string {
  const classes = [`${renderer.prefix}-layout-row`];
  if (display?.mode?.type) {
    classes.push(`${renderer.prefix}-layout-row-${display?.mode?.type}`);
  }
  return `<div class="${classes.join(' ')}">${html}</div>`;
}

/** Renders {@link html} as a "below the fold" read more. */
export function renderTruncateLayout(renderer: Renderer, html: string): string {
  return (
    `<details class="${renderer.prefix}-layout-truncate">` +
    `<summary>Keep reading</summary>${html}</details>`
  );
}
