import type {AskLayout} from './ask-layout';
import type {Attribution} from './attribution';
import type {AudioBlock} from './audio-block';
import type {ImageBlock} from './image-block';
import type {LinkBlock} from './link-block';
import type {VisualMedia} from './media';
import type {PaywallBlock} from './paywall-block';
import type {RowsDisplay, RowsLayout} from './rows-layout';
import type {
  TextBlock,
  TextBlockIndented,
  TextBlockNoIndent,
  InlineFormat,
} from './text-block';
import type {VideoBlock} from './video-block';

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
interface RenderOptions {
  /** @see Options.prefix */
  prefix: string;

  /** @see Options.askingAvatar */
  askingAvatar: VisualMedia[];
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
  | TextBlock
  | VideoBlock;

/**
 * A layout indicating how to lay out contents blocks.
 *
 * @see https://www.tumblr.com/docs/npf#layout-blocks
 */
export type Layout = AskLayout | RowsLayout;

/** The media for the default avatar to use for asks if none is provided. */
const anonymousAvatar: VisualMedia[] = [
  {
    width: 128,
    height: 128,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_128.gif',
  },
  {
    width: 96,
    height: 96,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_96.gif',
  },
  {
    width: 64,
    height: 64,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_64.gif',
  },
  {
    width: 48,
    height: 48,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_48.gif',
  },
];

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
    `<a class="${options.prefix}-attribution` +
    ` ${options.prefix}-attribution-${attribution.type}"` +
    ` href="${escapeHtml(href)}">`;

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
  let result = `<figure class="${options.prefix}-block-audio">`;
  if (block.media || !(block.embed_html || block.embed_url)) {
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
  } else {
    result += block.embed_html
      ? block.embed_html
      : `<iframe src="${escapeHtml(block.embed_url!)}"></iframe>`;

    if (block.attribution) {
      result +=
        '<figcaption>' +
        renderAttribution(block.attribution, options) +
        '</figcaption>';
    }
  }
  result += '</figure>';
  return result;
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
  if (block.is_visible === false) return '';

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
  result += '</a>';
  return result;
}

/** Converts {@link block} to HTML. */
function renderVideo(block: VideoBlock, options: RenderOptions): string {
  let result = `<figure class="${options.prefix}-block-video">`;
  if (
    block.media ||
    !(block.embed_html || block.embed_iframe || block.embed_url)
  ) {
    result +=
      '<video src="' +
      escapeHtml(
        block.media
          ? block.media.reduce((biggest, current) =>
              biggest && biggest.width > current.width ? biggest : current
            ).url
          : block.url!
      ) +
      '"';
    if (block.poster) {
      result +=
        ' poster="' +
        escapeHtml(
          block.poster.reduce((biggest, current) =>
            biggest && biggest.width > current.width ? biggest : current
          ).url
        ) +
        '"';
    }
    result += '></video>';
  } else if (block.embed_html) {
    result += block.embed_html;
  } else if (block.embed_iframe) {
    result +=
      `<iframe src="${escapeHtml(block.embed_iframe.url)}"` +
      ` width="${block.embed_iframe.width}"` +
      ` height="${block.embed_iframe.height}"></iframe>`;
  } else {
    result += `<iframe src="${escapeHtml(block.embed_url!)}"></iframe>`;
  }

  if (block.attribution) {
    result +=
      '<figcaption>' +
      renderAttribution(block.attribution, options) +
      '</figcaption>';
  }
  result += '</figure>';
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
      return `<span style="color: ${escapeHtml(format.hex)}">${html}</span>`;
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
      return `<p class="${options.prefix}-block-text-quirky">${text}</p>`;
    case 'quote':
      return `<p class="${options.prefix}-block-text-quote">${text}</p>`;
    case 'chat':
      return `<p class="${options.prefix}-block-text-chat">${text}</p>`;
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
 * An interface for layouts that apply to specific adjacent groups of content
 * blocks that *aren't* just rendered as individual rows.
 */
interface LayoutGroup {
  /** The layout describing how to render this group. */
  layout: AskLayout | RowsDisplay;

  /** The inclusive block index on which the group starts. */
  start: number;

  /** The exclusive block index before which the group ends. */
  end: number;
}

/**
 * If {@link options} includes layouts, this returns a list of {@link
 * LayoutGroup}s that indicate non-default layouts, ordered by start index.
 *
 * This assumes that all {@link LayoutGroup}s are contiguous and
 * non-overlapping.
 */
function buildLayoutGroups(options?: Options): LayoutGroup[] {
  const result: Array<AskLayout | RowsDisplay> = [];
  for (const layout of options?.layout ?? []) {
    if (layout.type === 'ask') {
      result.push(layout);
    } else {
      for (const display of layout.display) {
        if (display.blocks.length === 1) continue;
        result.push(display);
      }
    }
  }

  return result
    .map(layout => ({
      layout,
      start: Math.min(...layout.blocks),
      end: Math.max(...layout.blocks) + 1,
    }))
    .sort((a, b) => a.start - b.start);
}

/** Wraps {@link html} as an ask. */
function renderAskLayout(
  layout: AskLayout,
  html: string,
  options: RenderOptions
): string {
  let result = `<div class="${options.prefix}-layout-ask">`;
  if (layout.attribution) {
    result += `<a href="${escapeHtml(layout.attribution.blog.url)}">`;
  } else {
    // Always wrap the avatar in an A tag even if there's nothing to link to to
    // make it easier to style consistently.
    result += '<a>';
  }
  result +=
    renderImageMedia(options.askingAvatar, options) +
    '</a><figure><figcaption>';
  if (layout.attribution) {
    result += `<a href="${escapeHtml(layout.attribution.blog.url)}">`;
  }
  result +=
    '<strong>' +
    escapeHtml(layout.attribution?.blog?.name ?? 'Anonymous') +
    '</strong> asked:';
  if (layout.attribution) result += '</a>';
  result += '</figcaption>' + html + '</figure></div>';
  return result;
}

/** Wraps {@link html} as single row. */
function renderRowLayout(
  display: RowsDisplay,
  html: string,
  options: RenderOptions
): string {
  const classes = [`${options.prefix}-layout-row`];
  if (display?.mode?.type) {
    classes.push(`${options.prefix}-layout-row-${display?.mode?.type}`);
  }
  return `<div class="${classes.join(' ')}">${html}</div>`;
}

/** Renders {@link html} as a "below the fold" read more. */
function renderTruncate(html: string, options: RenderOptions): string {
  return (
    `<details class="${options.prefix}-layout-truncate">` +
    `<summary>Keep reading</summary>${html}</details>`
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
  const renderOptions = {
    prefix: options?.prefix ?? 'npf',
    askingAvatar: options?.askingAvatar ?? anonymousAvatar,
  };
  let result = '';

  const truncateAfter = options?.layout?.find(
    layout => layout.type === 'rows'
  )?.truncate_after;
  let truncateIndex: number | undefined;

  const layoutGroups = buildLayoutGroups(options);

  // HTML contents of the current `layoutGroup`, if there is one.
  let currentGroup = '';

  for (let i = 0; i < blocks.length; i++) {
    // Consumes all elements within a indented text block and renders them to a
    // string.
    const collectAndRenderIndented = (): string => {
      const first = blocks[i] as TextBlockIndented;
      const indentation = first.indent_level ?? 0;
      const blocksAndNested: [
        TextBlockIndented,
        ...Array<TextBlockIndented | string>,
      ] = [first];

      while (i < blocks.length - 1) {
        const sibling = blocks[i + 1];
        if (!isTextBlockIndented(sibling)) break;
        const siblingIndentation = sibling.indent_level ?? 0;
        if (siblingIndentation < indentation) break;
        if (siblingIndentation === indentation) {
          if (sibling.subtype !== first.subtype) break;
          i++;
          blocksAndNested.push(sibling);
        } else {
          i++;
          blocksAndNested.push(collectAndRenderIndented());
        }
      }

      return renderIndented(blocksAndNested, renderOptions);
    };

    let blockResult: string;
    const block = blocks[i];
    switch (block.type) {
      case 'audio':
        blockResult = renderAudio(block, renderOptions);
        break;

      case 'image':
        blockResult = renderImage(block, renderOptions);
        break;

      case 'link':
        blockResult = renderLink(block, renderOptions);
        break;

      case 'paywall':
        blockResult = renderPaywall(block, renderOptions);
        break;

      case 'video':
        blockResult = renderVideo(block, renderOptions);
        break;

      case 'text':
        if (isTextBlockIndented(block)) {
          blockResult = collectAndRenderIndented();
        } else {
          blockResult = renderTextNoIndent(block, renderOptions);
        }
        break;
    }

    const group = layoutGroups[0];
    if (group && i >= group.start) {
      currentGroup += blockResult;

      if (i + 1 === group.end) {
        layoutGroups.shift();
        if ('type' in group.layout) {
          result += renderAskLayout(group.layout, currentGroup, renderOptions);
        } else {
          result += renderRowLayout(group.layout, currentGroup, renderOptions);
        }
        currentGroup = '';
      }
    } else {
      result += blockResult;
    }

    if (i === truncateAfter) {
      truncateIndex = result.length;
    }
  }

  if (truncateIndex !== undefined) {
    result =
      result.substring(0, truncateIndex) +
      renderTruncate(result.substring(truncateIndex), renderOptions);
  }

  return result;
}
