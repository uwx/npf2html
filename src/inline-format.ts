import {BlogInfo} from './blog-info';
import {Renderer} from './renderer';

/**
 * A single piece of inline formatting for a {@link TextBlock}.
 *
 * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
 *
 * @category Inline
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
 *
 * @category Inline
 */
export interface InlineFormatBasic extends InlineFormatBase {
  type: 'bold' | 'italic' | 'strikethrough' | 'small';
}

/**
 * An inline link.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-link
 *
 * @category Inline
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
 *
 * @category Inline
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
 *
 * @category Inline
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
function buildFormatSpans(formatting: InlineFormat[]): InlineFormatSpan[] {
  // Sort formats first by start (earliest to latest), then by length (longest
  // to shortest). This ensures that earlier formats are never nested within
  // later ones.
  const formats = [...formatting].sort((a, b) =>
    a.start === b.start ? b.end - a.end : a.start - b.start
  );

  // A stack of open spans. Because formats is sorted by start, this will be as
  // well.
  const open: Array<Omit<InlineFormatSpan, 'end'>> = [];

  // The fully-closed spans of formatted text.
  const spans: InlineFormatSpan[] = [];

  let codePointIndex = 0;
  const end = Math.max(...formats.map(format => format.end));
  for (let i = 0; i < end; i++) {
    while (codePointIndex === formats[0]?.start) {
      open.push({format: formats.shift()!, start: i, children: []});
    }

    const outermostClosed = open.findIndex(
      span => span.format.end === codePointIndex + 1
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
          end: i + 1,
        });
        if (span.format.end > codePointIndex + 1) {
          stillOpen.push({...span, start: i + 1});
        }
      }
      -open.splice(outermostClosed);
      open.push(...stillOpen);
    }

    codePointIndex++;
  }

  if (open.length > 0) spans.push({...open[0], end});
  for (let i = 1; i < open.length; i++) {
    spans.at(-1)!.children.push({...open[i], end});
  }

  return spans;
}

/**
 * Applies the formatting specified by {@link format} to {@link html}, which may
 * already include nested formatting.
 *
 * @category Inline
 */
export function renderInlineFormat(
  renderer: Renderer,
  html: string,
  format: InlineFormat
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
      return `<a href="${renderer.escape(format.url)}">${html}</a>`;
    case 'mention':
      return (
        `<a class="${renderer.prefix}-inline-mention"` +
        ` href="${renderer.escape(format.blog.url)}">${html}</a>`
      );
    case 'color':
      return (
        `<span style="color: ${renderer.escape(format.hex)}">` +
        html +
        '</span>'
      );
  }
}

/** HTML-escapes {@link text} and formats it according to {@link formatting}. */
export function formatText(
  renderer: Renderer,
  text: string,
  formatting: InlineFormat[] | undefined
): string {
  if (!formatting) return renderer.escape(text);

  const renderSpans = (
    start: number,
    end: number,
    children: InlineFormatSpan[]
  ): string => {
    let result = '';
    let i = start;
    for (const child of children) {
      result +=
        renderer.escape(text.substring(i, child.start)) +
        renderer.renderInlineFormat(
          renderSpans(child.start, child.end, child.children),
          child.format
        );
      i = child.end;
    }
    return result + renderer.escape(text.substring(i, end));
  };

  return renderSpans(0, text.length, buildFormatSpans(formatting));
}
