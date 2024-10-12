import {BlogInfo} from './blog-info';

/**
 * An NPF text type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-text
 */
export type TextBlock = TextBlockNoIndent | TextBlockIndented;

/** The base interface for all types of text blocks. */
interface TextBlockBase {
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

  /**
   * Inline formatting for this text.
   *
   * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
   */
  formatting?: InlineFormat[];
}

/** A text block of a type that doesn't allow indentation. */
export interface TextBlockNoIndent extends TextBlockBase {
  subtype?: 'heading1' | 'heading2' | 'quirky' | 'quote' | 'chat';
}

/** A text block of a type that allows indentation. */
export interface TextBlockIndented extends TextBlockBase {
  /**
   * The subtype of text block.
   *
   * @see https://www.tumblr.com/docs/npf#text-block-subtypes
   */
  subtype: 'indented' | 'ordered-list-item' | 'unordered-list-item';

  /** @see https://www.tumblr.com/docs/npf#text-block-subtype-list-item */
  indent_level?: number;
}

/**
 * A single piece of inline formatting for a {@link TextBlock}.
 *
 * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
 */
export type InlineFormat =
  | InlineFormatBasic
  | InlineFormatLink
  | InlineFormatMention
  | InlineFormatColor;

/** The base interface for all types of inline formatting. */
interface InlineFormatBase {
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
export interface InlineFormatMention extends InlineFormatBase {
  type: 'mention';

  /** The mentioned blog. */
  blog: BlogInfo;
}

/**
 * Colored text.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-color
 */
export interface InlineFormatColor extends InlineFormatBase {
  type: 'color';

  /** The color to use, in standard hex format, with leading #. */
  hex: string;
}
