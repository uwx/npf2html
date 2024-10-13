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
