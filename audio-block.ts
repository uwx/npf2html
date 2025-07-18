import type { Attribution } from './attribution.js';
import type { Media, VisualMedia } from './media.js';
import {Renderer} from './renderer.js';

/**
 * An NPF audio type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-audio
 *
 * @category Content
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
  embedHtml?: string;

  /** A URL to the embeddable content to use as an iframe. */
  embedUrl?: string;

  /** Optional provider-specific metadata about the audio track. */
  metadata?: Record<string, unknown>;

  /** Optional attribution information about where the audio track came from. */
  attribution?: Attribution;
}

/**
 * Converts {@link block} to HTML.
 *
 * @category Content
 */
export function renderAudio(renderer: Renderer, block: AudioBlock): string {
  let result = `<figure class="${renderer.prefix}-block-audio">`;
  if (block.media || !(block.embedHtml || block.embedUrl)) {
    const hasText = block.title || block.artist || block.album;
    const hasCaption = block.poster || block.attribution || hasText;
    if (block.media) {
      result +=
        `<audio controls src="${renderer.escape(block.media[0].url)}">` +
        '</audio>';
      if (hasCaption) result += '<figcaption>';
    } else {
      result += `<a href="${renderer.escape(block.url!)}">`;
    }

    if (block.poster) {
      result += renderer.renderImageMedia(block.poster);
    }
    if (block.title) {
      result +=
        `<span class="${renderer.prefix}-block-audio-title">` +
        renderer.escape(block.title) +
        '</span>';
    }
    if (block.artist) {
      if (block.title) result += ' - ';
      result +=
        `<span class="${renderer.prefix}-block-audio-artist">` +
        renderer.escape(block.artist) +
        '</span>';
    }
    if (block.album) {
      if (block.title || block.artist) result += ' on ';
      result +=
        `<span class="${renderer.prefix}-block-audio-album">` +
        renderer.escape(block.album) +
        '</span>';
    }
    if (!block.media) {
      if (!hasText) result += renderer.escape(block.url!);
      result += '</a>';
    }

    if (block.attribution) {
      if (!block.media) result += '<figcaption>';
      result += renderer.renderAttribution(block.attribution);
      if (!block.media) result += '</figcaption>';
    }

    if (block.media && hasCaption) result += '</figcaption>';
  } else {
    result += block.embedHtml
      ? block.embedHtml
      : `<iframe src="${renderer.escape(block.embedUrl!)}"></iframe>`;

    if (block.attribution) {
      result +=
        '<figcaption>' +
        renderer.renderAttribution(block.attribution) +
        '</figcaption>';
    }
  }
  result += '</figure>';
  return result;
}
