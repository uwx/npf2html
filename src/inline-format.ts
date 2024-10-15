import {BlogInfo} from './blog-info';
import {RenderOptions} from './options';
import {TextBlock} from './text-block';
import {escapeHtml} from './utils';

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

/**
 * An intermediate interface used when processing inline formatting that
 * represents a specific kind of formatting, its range in terms of JS indices,
 * and the formatting nested within it.
 */
interface InlineFormatSpan {
  /** The formatting to apply. */
  format: InlineFormat;

  /**
   * The inclusive JavaScript-style (code unit) index in the text at which this
   * span starts.
   */
  start: number;

  /**
   * The exclusive JavaScript-style (code unit) index in the text at which this
   * span ends.
   */
  end: number;

  /**
   * The inline formatting spans nested within this one.
   *
   * These must cover subsets of this span, and they must not overlap one
   * another.
   */
  children: InlineFormatSpan[];
}

/** Builds the list of {@link InlineFormatSpan}s for {@link block}. */
function buildFormatSpans(block: TextBlock): InlineFormatSpan[] {
  // Sort formats first by start (earliest to latest), then by length (longest
  // to shortest). This ensures that earlier formats are never nested within
  // later ones.
  const formats = [...block.formatting!].sort((a, b) =>
    a.start === b.start ? b.end - a.end : a.start - b.start
  );

  // A stack of open spans. Because formats is sorted by start, this will be as
  // well.
  const open: Array<Omit<InlineFormatSpan, 'end'>> = [];

  // The fully-closed spans of `block.text`.
  const spans: InlineFormatSpan[] = [];

  let codePointIndex = 0;
  for (let i = 0; i < block.text.length; i++) {
    while (codePointIndex === formats[0]?.start) {
      open.push({format: formats.shift()!, start: i, children: []});
    }

    const outermostClosed = open.findIndex(
      span => span.format.end === codePointIndex
    );

    if (outermostClosed !== -1) {
      // Tumblr allows inline formats to overlap without being subsets of one
      // another. To handle this in HTML, we track the formats that aren't
      // closed yet and add them back into `open` afterwards.
      const stillOpen = [];
      for (let j = outermostClosed; j < open.length; j++) {
        const span = open[j];
        (j === 0 ? spans : open[j - 1].children).push({
          ...span,
          end: i,
        });
        if (span.format.end > codePointIndex) {
          stillOpen.push({...span, start: i});
        }
      }
      -open.splice(outermostClosed);
      open.push(...stillOpen);
    }

    // A character is a high surrogate exactly if it matches 0b110110XXXXXXXXXX.
    // 0x36 == 0b110110.
    if (block.text.charCodeAt(i) >> 10 === 0x36) i++;
    codePointIndex++;
  }

  if (open.length > 0) spans.push({...open[0], end: block.text.length});
  for (let i = 1; i < open.length; i++) {
    spans.at(-1)!.children.push({...open[i], end: block.text.length});
  }

  return spans;
}

/**
 * Applies the formatting specified by {@link format} to {@link html}, which may
 * already include nested formatting.
 */
function renderInlineFormat(
  html: string,
  format: InlineFormat,
  options: RenderOptions
): string {
  switch (format.type) {
    case 'bold':
      return `<strong>${html}</strong>`;
    case 'italic':
      return `<em>${html}</em>`;
    case 'strikethrough':
      return `<s>${html}</s>`;
    case 'small':
      return `<small>${html}</small>`;
    case 'link':
      return `<a href="${escapeHtml(format.url)}">${html}</a>`;
    case 'mention':
      return (
        `<a class="${options.prefix}-inline-mention"` +
        ` href="${escapeHtml(format.blog.url)}">${html}</a>`
      );
    case 'color':
      return `<span style="color: ${escapeHtml(format.hex)}">${html}</span>`;
  }
}

/**
 * Formats the text contents of {@link block} according to {@link
 * TextblockBase.formatting}. Return HTML-safe text.
 */
export function formatText(block: TextBlock, options: RenderOptions): string {
  if (!block.formatting) return escapeHtml(block.text);

  const renderSpans = (
    start: number,
    end: number,
    children: InlineFormatSpan[]
  ): string => {
    let result = '';
    let i = start;
    for (const child of children) {
      result +=
        escapeHtml(block.text.substring(i, child.start)) +
        renderInlineFormat(
          renderSpans(child.start, child.end, child.children),
          child.format,
          options
        );
      i = child.end;
    }
    return result + escapeHtml(block.text.substring(i, end));
  };

  const spans = buildFormatSpans(block);
  return renderSpans(0, block.text.length, spans);
}
