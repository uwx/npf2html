import {VisualMedia} from './media';
import {Layout} from './index';

/** Options for {@link npf2html}. */
export interface Options {
  /**
   * The prefix to use for class names used to disambiguate block types and
   * subtypes that don't map cleanly to HTML tags. Defaults to `"npf"`.
   *
   * This is also used for CSS variables to convey additional style information
   * about the blocks.
   */
  prefix?: string;

  /**
   * The layouts describing how to group different content blocks.
   *
   * This is available from `post.layout` in the Tumblr API.
   */
  layout?: Layout[];

  /**
   * The {@link VisualMedia} to use for the asker's avatar if the post being
   * rendered is an ask.
   *
   * This is avialable from `post.asking_avatar` in the Tumblr API.
   */
  askingAvatar?: VisualMedia[];
}

/**
 * Options passed to each render method.
 *
 * This is a subset of {@link Options} with all options filled in by defaults if
 * they weren't originally defined.
 */
export interface RenderOptions {
  /** @see Options.prefix */
  prefix: string;

  /** @see Options.askingAvatar */
  askingAvatar: VisualMedia[];
}
