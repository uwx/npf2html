import {BlogAttribution} from './attribution';

/**
 * Content blocks that are part of an ask.
 *
 * @see https://www.tumblr.com/docs/npf#layout-block-type-ask
 */
export interface AskLayout {
  type: 'ask';

  /** An array of block indices that are a part of the ask content of the Post. */
  blocks: number[];

  /**
   * If the ask is not anonymous, this will include information about the blog
   * that submitted the ask.
   */
  attribution?: BlogAttribution;
}
