import {RenderOptions} from './options';

/**
 * Content blocks organized in rows, with variable elements per row.
 *
 * @see https://www.tumblr.com/docs/npf#layout-block-type-rows
 */
export interface RowsLayout {
  type: 'rows';

  /** A list of ways to display sets of rows. */
  display: RowsDisplay[];

  /** How the content should be truncated. */
  truncate_after?: number;
}

/** An object describing how to display a single row. */
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

/** Wraps {@link html} as single row. */
export function renderRowLayout(
  display: RowsDisplay,
  html: string,
  options: RenderOptions
): string {
  const classes = [`${options.prefix}-layout-row`];
  if (display?.mode?.type) {
    classes.push(`${options.prefix}-layout-row-${display?.mode?.type}`);
  }
  return `<div class="${classes.join(' ')}">${html}</div>`;
}

/** Renders {@link html} as a "below the fold" read more. */
export function renderTruncateLayout(
  html: string,
  options: RenderOptions
): string {
  return (
    `<details class="${options.prefix}-layout-truncate">` +
    `<summary>Keep reading</summary>${html}</details>`
  );
}
