import {VisualMedia} from './media';
import npf2html, {Layout} from './index';
import {Renderer} from './renderer';

/**
 * Options for {@link npf2html}.
 *
 * @category Main
 */
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
   * This is available from `post.asking_avatar` in the Tumblr API.
   */
  askingAvatar?: VisualMedia[];

  /**
   * A custom {@link Renderer} to use to convert NPF components to HTML.
   *
   * If this is passed, {@link prefix} and {@link askingAvatar} are ignored in
   * favor of the corresponding values in {@link renderer}.
   */
  renderer?: Renderer;
}
