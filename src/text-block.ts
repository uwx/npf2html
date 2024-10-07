import {BlogInfo} from './blog-info';

/**
 * An NPF text type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-text
 */
export interface TextBlock {
  type: 'text';

  /** The text to use inside this block. */
  text: string;

  /**
   * The subtype of text block.
   *
   * @see https://www.tumblr.com/docs/npf#text-block-subtypes
   */
  subtype?:
    | 'heading1'
    | 'heading2'
    | 'quirky'
    | 'quote'
    | 'indented'
    | 'chat'
    | 'ordered-list-item'
    | 'unordered-list-item';

  /** @see https://www.tumblr.com/docs/npf#text-block-subtype-list-item */
  indent_level?: number;

  /**
   * Inline formatting for this text.
   *
   * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
   */
  formatting?: InlineFormat[];
}

/** Inline formatting types. */
export type InlineFormat =
  | InlineFormatBasic
  | InlineFormatLink
  | InlineFormatMention
  | InlineFormatColor;

/**
 * A single piece of inline formatting for a {@link TextBlock}.
 *
 * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
 */
export interface InlineFormatBase {
  /** The starting index of the formatting range (inclusive). */
  start: number;

  /** The ending index of the formatting range (inclusive). */
  end: number;
}

/**
 * Basic inline formatting types that require no additional information.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-types-bold-italic-strikethrough-small
 */
export interface InlineFormatBasic extends InlineFormatBase {
  type: 'bold' | 'italic' | 'strikethrough' | 'small';
}

/**
 * An inline link.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-link
 */
export interface InlineFormatLink extends InlineFormatBase {
  type: 'link';

  /** The link's URL. */
  url: string;
}

/**
 * A mention of another blog.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-mention
 */
export interface InlineFormatMention {
  type: 'mention';

  /** The mentioned blog. */
  blog: BlogInfo;
}

/**
 * Colored text.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-color
 */
export interface InlineFormatColor {
  type: 'color';

  /** The color to use, in standard hex format, with leading #. */
  hex: string;
}
