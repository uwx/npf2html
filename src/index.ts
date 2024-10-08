import type {AskLayout} from './ask-layout';
import type {AudioBlock} from './audio-block';
import type {ImageBlock} from './image-block';
import type {LinkBlock} from './link-block';
import type {PaywallBlock} from './paywall-block';
import type {RowsLayout} from './rows-layout';
import type {TextBlock} from './text-block';

export type {AskLayout} from './ask-layout';
export type {
  Attribution,
  PostAttribution,
  Post,
  LinkAttribution,
  BlogAttribution,
  AppAttribution,
} from './attribution';
export type {AudioBlock} from './audio-block';
export type {BlogInfo} from './blog-info';
export type {Media, VisualMedia} from './media';
export type {
  PaywallBlock,
  PaywallBlockCta,
  PaywallBlockDivider,
} from './paywall-block';
export type {RowsDisplay, RowsLayout} from './rows-layout';
export type {
  TextBlock,
  InlineFormat,
  InlineFormatBasic,
  InlineFormatLink,
  InlineFormatMention,
  InlineFormatColor,
} from './text-block';
export type {VideoBlock, IFrame} from './video-block';

/** Options for {@link npf2html}. */
export interface Npf2HtmlOptions {
  /**
   * The prefix to use for class names used to disambiguate block types and
   * subtypes that don't map cleanly to HTML tags.
   */
  classPrefix?: string;

  /**
   * The layouts, usually provided in a post object's `layout` field.
   */
  layout?: Layout[];
}

/**
 * A single discrete unit of content.
 *
 * @see https://www.tumblr.com/docs/npf#content-blocks
 */
export type ContentBlock =
  | AudioBlock
  | ImageBlock
  | LinkBlock
  | PaywallBlock
  | TextBlock;

/**
 * A layout indicating how to lay out contents blocks.
 *
 * @see https://www.tumblr.com/docs/npf#layout-blocks
 */
export type Layout = AskLayout | RowsLayout;

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
