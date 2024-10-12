import type {AskLayout} from './ask-layout';
import type {Attribution} from './attribution';
import type {AudioBlock} from './audio-block';
import type {ImageBlock} from './image-block';
import type {LinkBlock} from './link-block';
import type {VisualMedia} from './media';
import type {PaywallBlock} from './paywall-block';
import type {RowsLayout} from './rows-layout';
import type {
  TextBlock,
  TextBlockIndented,
  TextBlockNoIndent,
  InlineFormat,
} from './text-block';

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
  TextBlockNoIndent,
  TextBlockIndented,
  InlineFormat,
  InlineFormatBasic,
  InlineFormatLink,
  InlineFormatMention,
  InlineFormatColor,
} from './text-block';
export type {VideoBlock, IFrame} from './video-block';

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
   * The layouts, usually provided in a post object's `layout` field.
   */
  layout?: Layout[];
}

/**
 * Options passed to each render method.
 *
 * This is a subset of {@link Options} with all options filled in by defaults if
 * they weren't originally defined.
 */
interface RenderOptions {
  /** @see Options.prefix */
  prefix: string;
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

/** Returns {@link unsafe} with all HTML escaped. */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Converts {@link media} to HTML. */
function renderImageMedia(
  media: VisualMedia[],
  options: RenderOptions & {alt?: string}
): string {
  let result = `<img src="${escapeHtml(media[0].url)}"`;

  if (media.length > 1) {
    const minWidth = Math.min(...media.map(image => image.width));

    const srcset = [];
    for (const image of media) {
      srcset.push(`${image.url} ${image.width / minWidth}x`);
    }
    result += ` srcset="${escapeHtml(srcset.join(','))}"`;
  }

  if (options.alt) result += ` alt="${escapeHtml(options.alt)}"`;
  result += '>';
  return result;
}

/** Converts {@link attribution} to HTML. */
function renderAttribution(
  attribution: Attribution,
  options: RenderOptions
): string {
  const href =
    attribution.type === 'blog' ? attribution.blog.url : attribution.url;
  let result =
    `<a class="${options.prefix}-attribution" ` + `href="${escapeHtml(href)}">`;

  switch (attribution.type) {
    case 'post':
    case 'blog':
      result += escapeHtml(attribution.blog.name);
      break;

    case 'link':
      result += escapeHtml(attribution.url);
      break;

    case 'app': {
      const display = attribution.display_text || attribution.app_name;
      if (display) result += escapeHtml(display);
      if (attribution.logo) {
        result += renderImageMedia([attribution.logo], options);
      } else if (!attribution.display_text && !attribution.app_name) {
        result += escapeHtml(attribution.url);
      }
    }
  }

  return result + '</a>';
}

/** Converts {@link block} to HTML. */
function renderAudio(block: AudioBlock, options: RenderOptions): string {
  if (block.media || !(block.embed_html || block.embed_url)) {
    let result = `<figure class="${options.prefix}-block-audio">`;

    const hasText = block.title || block.artist || block.album;
    const hasCaption = block.poster || block.attribution || hasText;
    if (block.media) {
      result += `<audio controls src="${escapeHtml(block.media[0].url)}"></audio>`;
      if (hasCaption) result += '<figcaption>';
    } else {
      result += `<a href="${escapeHtml(block.url!)}">`;
    }

    if (block.poster) {
      result += renderImageMedia(block.poster, options);
    }
    if (block.title) {
      result +=
        `<span class="${options.prefix}-block-audio-title">` +
        escapeHtml(block.title) +
        '</span>';
    }
    if (block.artist) {
      if (block.title) result += ' - ';
      result +=
        `<span class="${options.prefix}-block-audio-artist">` +
        escapeHtml(block.artist) +
        '</span>';
    }
    if (block.album) {
      if (block.title || block.artist) result += ' on ';
      result +=
        `<span class="${options.prefix}-block-audio-album">` +
        escapeHtml(block.album) +
        '</span>';
    }
    if (!block.media) {
      if (!hasText) result += escapeHtml(block.url!);
      result += '</a>';
    }

    if (block.attribution) {
      result += renderAttribution(block.attribution, options);
    }

    if (block.media && hasCaption) result += '</figcaption>';

    result += '</figure>';
    return result;
  } else if (block.embed_html) {
    return (
      `<figure class="${options.prefix}-block-audio">${block.embed_html}` +
      '</figure>'
    );
  } else {
    return (
      `<iframe class="${options.prefix}-block-audio"` +
      ` src="${escapeHtml(block.embed_url!)}"></iframe>`
    );
  }
}

/** Converts {@link block} to HTML. */
function renderImage(block: ImageBlock, options: RenderOptions): string {
  let result =
    `<figure class="${options.prefix}-block-image">` +
    renderImageMedia(block.media, {...options, alt: block.alt_text});
  if (block.caption || block.attribution) {
    result += '<figcaption>';
    if (block.caption) {
      result +=
        '<span class="${options.prefix}-block-image-caption">' +
        escapeHtml(block.caption) +
        '</span>';
    }
    if (block.attribution)
      result += renderAttribution(block.attribution, options);
    result += '</figcaption>';
  }
  result += '</figure>';
  return result;
}

/** Convets {@link block} to HTML. */
function renderLink(block: LinkBlock, options: RenderOptions): string {
  let result =
    `<a class="${options.prefix}-block-link"` +
    ` href="${escapeHtml(block.url)}">`;
  if (block.poster) {
    result += renderImageMedia(block.poster, options);
  }
  result +=
    '<h2>' +
    escapeHtml(block.title ?? block.display_url ?? block.url) +
    '</h2>';
  if (block.site_name) {
    result +=
      `<p class="${options.prefix}-block-link-site">` +
      `${escapeHtml(block.site_name)}</p>`;
  }
  if (block.author) {
    result +=
      `<p class="${options.prefix}-block-link-author">` +
      `${escapeHtml(block.author)}</p>`;
  }
  if (block.description) {
    result +=
      `<p class="${options.prefix}-block-link-description">` +
      `${escapeHtml(block.description)}</p>`;
  }
  result += '</a>';
  return result;
}

/** Converts {@link block} to HTML. */
function renderPaywall(block: PaywallBlock, options: RenderOptions): string {
  if (!block.is_visible) return '';

  let result =
    `<a class="${options.prefix}-block-paywall ` +
    `${options.prefix}-block-paywall-${block.subtype}"` +
    ` href="${escapeHtml(block.url)}"`;
  if (block.subtype === 'divider' && block.color) {
    result += ` style="--${options.prefix}-paywall-color: ${block.color}"`;
  }
  result += '>';
  if (block.subtype !== 'divider' && block.title) {
    result += `<h2>${escapeHtml(block.title)}</h2>`;
  }
  if (block.text) {
    result += `<p>${escapeHtml(block.text)}</p>`;
  }
  return result;
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
  // Assume these are sorted by `InlineFormat.start`.
  const formats = [...block.formatting!];

  // A stack of open spans. Because formats is sorted by start, this will be as
  // well.
  const open: Array<Omit<InlineFormatSpan, 'end'>> = [];

  // The fully-closed spans of `block.text`.
  const spans: InlineFormatSpan[] = [];

  let codePointIndex = 0;
  for (let i = 0; i < block.text.length; i++) {
    while (codePointIndex === formats[0].start) {
      open.push({format: formats.shift()!, start: i, children: []});
    }

    const outermostClosed = open.findIndex(
      span => span.format.end === codePointIndex
    );
    if (outermostClosed !== -1) {
      spans.push({
        ...open[outermostClosed],
        end: i,
      });

      // Tumblr allows inline formats to overlap without being subsets of one
      // another. To handle this in HTML, we track the formats that aren't
      // closed yet and add them back into `open` afterwards.
      const stillOpen = [];
      for (let j = outermostClosed + 1; j < open.length; j++) {
        const span = open[j];
        spans.at(-1)!.children.push({...span, end: i});
        if (span.format.end > codePointIndex) {
          stillOpen.push({...span, start: i});
        }
      }
      open.splice(outermostClosed);
      open.push(...stillOpen);
    }

    // A character is a high surrogate exactly if it matches 0b110110XXXXXXXXXX.
    // 0x36 == 0b110110.
    if (block.text.charCodeAt(i) >> 10 === 0x36) i++;
    codePointIndex++;
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
      return (
        `<span class="${options.prefix}-inline-strikethrough">${html}` +
        '</span>'
      );
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
      return `<span style="color: ${escapeHtml(format.hex)}>${html}</span>`;
  }
}

/**
 * Formats the text contents of {@link block} according to {@link
 * TextblockBase.formatting}. Return HTML-safe text.
 */
function formatText(block: TextBlock, options: RenderOptions): string {
  if (!block.formatting) return escapeHtml(block.text);

  const renderSpans = (
    start: number,
    end: number,
    children: InlineFormatSpan[]
  ): string => {
    let result = '';
    const i = start;
    for (const child of children) {
      result +=
        escapeHtml(block.text.substring(i, child.start)) +
        renderInlineFormat(
          renderSpans(child.start, child.end, child.children),
          child.format,
          options
        );
    }
    return result + escapeHtml(block.text.substring(i, end));
  };

  return renderSpans(0, block.text.length, buildFormatSpans(block));
}

/** Converts {@link block} to HTML. */
function renderTextNoIndent(
  block: TextBlockNoIndent,
  options: RenderOptions
): string {
  const text = formatText(block, options);
  switch (block.subtype) {
    case 'heading1':
      return `<h1>${text}</h1>`;
    case 'heading2':
      return `<h2>${text}</h2>`;
    case 'quirky':
      return `<p class="${options.prefix}-text-quirky">${text}</p>`;
    case 'quote':
      return `<p class="${options.prefix}-text-quote">${text}</p>`;
    case 'chat':
      return `<p class="${options.prefix}-text-chat">${text}</p>`;
    default:
      return `<p>${text}</p>`;
  }
}

/**
 * Converts {@link blocksAndNested} to HTML.
 *
 * The first element of {@link blocksAndNested} determined the subtype of the
 * entire thing; any other blocks are guaranteed to have the same subtype. The
 * string elements of {@link blocksAndNested} ar {@link TextBlockIndented}
 * objects which are more deeply nested and have already been converted to HTML.
 */
function renderIndented(
  blocksAndNested: [TextBlockIndented, ...Array<TextBlockIndented | string>],
  options: RenderOptions
): string {
  const {subtype} = blocksAndNested[0];
  let contents = {
    indented: '<blockquote>',
    'ordered-list-item': '<ol>',
    'unordered-list-item': '<ul>',
  }[subtype];

  for (const element of blocksAndNested) {
    const string = typeof element === 'string';
    contents += subtype === 'indented' ? (string ? '' : '<p>') : '<li>';
    contents += string ? element : formatText(element, options);
    contents += subtype === 'indented' ? (string ? '' : '</p>') : '</li>';
  }
  contents += {
    indented: '</blockquote>',
    'ordered-list-item': '</ol>',
    'unordered-list-item': '</ul>',
  }[subtype];
  return contents;
}

/** Returns whether {@link block} is a {@link TextBlockIndented}. */
function isTextBlockIndented(block: ContentBlock): block is TextBlockIndented {
  return (
    block.type === 'text' &&
    (block.subtype === 'indented' ||
      block.subtype === 'ordered-list-item' ||
      block.subtype === 'unordered-list-item')
  );
}

/**
 * Converts each NPF block in {@link blocks} to plain HTML and concatenates them
 * into a single string.
 */
export default function npf2html(
  blocks: ContentBlock[],
  options?: Options
): string {
  const renderOptions = {prefix: options?.prefix ?? 'npf'};
  let result = '';

  // TODO: handle layouts

  for (let i = 0; i < blocks.length; i++) {
    // Consumes all elements within a indented text block and renders them to a
    // string.
    const collectAndRenderIndented = (first: TextBlockIndented): string => {
      const indentation = first.indent_level ?? 0;
      const blocksAndNested: [
        TextBlockIndented,
        ...Array<TextBlockIndented | string>,
      ] = [first];
      for (; i < blocks.length - 1; i++) {
        const sibling = blocks[i + 1];
        if (!isTextBlockIndented(sibling)) break;
        const siblingIndentation = sibling.indent_level ?? 0;
        if (siblingIndentation < indentation) break;
        if (siblingIndentation === first.indent_level) {
          if (sibling.subtype !== first.subtype) break;
          blocksAndNested.push(sibling);
        } else {
          blocksAndNested.push(collectAndRenderIndented(sibling));
        }
      }

      return renderIndented(blocksAndNested, renderOptions);
    };

    const block = blocks[i];
    switch (block.type) {
      case 'audio':
        result += renderAudio(block, renderOptions);
        break;

      case 'image':
        result += renderImage(block, renderOptions);
        break;

      case 'link':
        result += renderLink(block, renderOptions);
        break;

      case 'paywall':
        result += renderPaywall(block, renderOptions);
        break;

      case 'text':
        if (isTextBlockIndented(block)) {
          result += collectAndRenderIndented(block);
        } else {
          result += renderTextNoIndent(block, renderOptions);
        }
        break;
    }
  }
  return result;
}
