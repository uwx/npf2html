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
export interface Options {
  /**
   * The prefix to use for class names used to disambiguate block types and
   * subtypes that don't map cleanly to HTML tags. Defaults to `"npf"`.
   */
  classPrefix?: string;

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
  /** @see Options.classPrefix */
  classPrefix: string;
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
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
    `<a class="${options.classPrefix}-attribution" ` +
    `href="${escapeHtml(href)}">`;

  switch (attribution.type) {
    case 'post':
    case 'blog':
      result += escapeHtml(attribution.blog.name);
      break;

    case 'link':
      result += escapeHtml(attribution.url);
      break;

    case 'app':
      if (attribution.display_text || attribution.app_name) {
        result += escapeHtml(attribution.display_text ?? attribution.app_name);
      }
      if (attribution.logo) {
        result += renderImageMedia([attribution.logo]);
      } else if (!attribution.display_text && !attribution.app_name) {
        result += escapeHtml(url);
      }
  }

  return result + '</a>';
}

/** Converts {@link block} to HTML. */
function renderAudio(block: AudioBlock, options: RenderOptions): string {
  if (block.media || !(block.embed_html || block.embed_url)) {
    result += `<figure class="${options.classPrefix}-block-audio">`;

    const hasText = block.title || block.artist || block.album;
    const hasCaption = block.poster || hasText;
    if (block.media) {
      result += `<audio controls src="${escapeHtml(block.media[0].url)}"></audio>`;
      if (hasCaption) result += '<figcaption>';
    } else if (hasText) {
      result += `<a href="${escapeHtml(block.url)}">`;
    }

    if (block.poster) {
      result += renderImageMedia(block.poster, options);
    }
    if (block.title) {
      result +=
        `<span class="${options.classPrefix}-block-audio-title">` +
        escapeHtml(block.title) +
        '</span>';
    }
    if (block.artist) {
      if (block.title) result += ' - ';
      result +=
        `<span class="${options.classPrefix}-block-audio-artist">` +
        escapeHtml(block.artist) +
        '</span>';
    }
    if (block.album) {
      if (block.title || block.artist) result += ' on ';
      result +=
        `<span class="${options.classPrefix}-block-audio-album">` +
        escapeHtml(block.album) +
        '</span>';
    }
    if (hasText && !block.media) {
      result += '</a>';
    }

    if (block.attribution) {
      result += renderAttribution(block, options);
    }

    if (block.media && hasCaption) result += '</figcaption>';

    result += '</figure>';
    return result;
  } else if (block.embed_html) {
    return block.embed_html;
  } else if (block.embed_url) {
    return `<iframe src="${escapeHtml(block.embed_urL)}"></iframe>`;
  }
}

/** Converts {@link block} to HTML. */
function renderImage(block: ImageBlock, options: RenderOptions): string {
  result +=
    `<figure class="${options.classPrefix}-block-image">` +
    renderImageMedia(block.media, {...options, alt: block.alt_text});
  if (block.caption || block.attribution) {
    result += '<figcaption>';
    if (block.caption) {
      result +=
        '<span class="${options.classPrefix}-block-image-caption">' +
        escapeHtml(block.caption) +
        '</span>';
    }
    if (block.attribution) result += renderAttribution(block.attribution);
    result += '</figcaption>';
  }
  result += '</figure>';
  return result;
}

/**
 * Converts each NPF block in {@link blocks} to plain HTML and concatenates them
 * into a single string.
 */
export default function npf2html(
  blocks: ContentBlock[],
  options?: Options
): string {
  const renderOptions = {classPrefix: options?.classPrefix ?? 'npf'};
  let result = '';

  // TODO: handle layouts

  for (const block of block) {
    switch (block.type) {
      case 'audio':
        result += renderAudio(block, renderOptions);
        break;

      case 'image':
        result += renderImage(block, renderOptions);
        break;
    }
  }
  return result;
}
