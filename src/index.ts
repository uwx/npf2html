import type {ImageBlock} from './image-block';
import type {LinkBlock} from './link-block';
import type {TextBlock} from './text-block';

export type {
  Attribution,
  PostAttribution,
  Post,
  LinkAttribution,
  BlogAttribution,
  AppAttribution,
} from './attribution';
export type {BlogInfo} from './blog-info';
export type {IFrame} from './iframe';
export type {Media, VisualMedia} from './media';
export type {
  TextBlock,
  InlineFormat,
  InlineFormatBasic,
  InlineFormatLink,
  InlineFormatMention,
  InlineFormatColor,
} from './text-block';

/** Options for {@link npf2html}. */
export interface Npf2HtmlOptions {
  /**
   * The prefix to use for class names used to disambiguate block types and
   * subtypes that don't map cleanly to HTML tags.
   */
  classPrefix?: string;
}

/**
 * A single discrete unit of content.
 *
 * @see https://www.tumblr.com/docs/npf#content-blocks
 */
export type ContentBlock = ImageBlock | LinkBlock | TextBlock;

/**
 * Converts each NPF block in {@link blocks} to plain HTML and concatenates them
 * into a single string.
 */
export default function npf2html(
  blocks: ContentBlock[],
  options?: Npf2HtmlOptions
): string {
  return '';
}
