import {Attribution, renderAttribution} from './attribution';
import {Media, VisualMedia, renderImageMedia} from './media';
import {RenderOptions} from './options';
import {escapeHtml} from './utils';

/**
 * An NPF audio type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-audio
 */
export interface AudioBlock {
  type: 'audio';

  /**
   * The URL to use for the audio block. Either this, {@link media}, or both
   * will always be set.
   */
  url?: string;

  /**
   * The {@link Media} to use for the audio block. Either this, {@link url}, or
   * both will always be set.
   */
  media?: Media[];

  /**
   * The provider of the audio source, whether it's `tumblr` for native audio or
   * a trusted third party.
   */
  provider?: string;

  /** The title of the audio asset. */
  title?: string;

  /** The artist of the audio asset. */
  artist?: string;

  /** The album from which the audio asset originated. */
  album?: string;

  /**
   * An image media object to use as a "poster" for the audio track, usually
   * album art.
   */
  poster?: VisualMedia[];

  /** HTML code that could be used to embed this audio track into a webpage. */
  embed_html?: string;

  /** A URL to the embeddable content to use as an iframe. */
  embed_url?: string;

  /** Optional provider-specific metadata about the audio track. */
  metadata?: Record<string, unknown>;

  /** Optional attribution information about where the audio track came from. */
  attribution?: Attribution;
}

/** Converts {@link block} to HTML. */
export function renderAudio(block: AudioBlock, options: RenderOptions): string {
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
      if (!block.media) result += '<figcaption>';
      result += renderAttribution(block.attribution, options);
      if (!block.media) result += '</figcaption>';
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
