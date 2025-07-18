import type { Attribution } from './attribution.js';
import type { VisualMedia } from './media.js';
import {Renderer} from './renderer.js';

/**
 * An NPF video type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-video
 *
 * @category Content
 */
export interface VideoBlock {
  type: 'video';

  /**
   * The URL to use for the video block. Either this, {@link media}, or both
   * will always be set.
   */
  url?: string;

  /**
   * The {@link Media} to use for the video block. Either this, {@link url}, or
   * both will always be set.
   */
  media?: VisualMedia;

  /**
   * The provider of the audio source, whether it's `tumblr` for native audio or
   * a trusted third party.
   */
  provider?: string;

  /** HTML code that could be used to embed this video into a webpage. */
  embedHtml?: string;

  /** An {@link IFrame} used for constructing video iframes. */
  embedIframe?: IFrame;

  /** A URL to the embeddable content to use as an iframe. */
  embedUrl?: string;

  /**
   * An image media object to use as a "poster" for the video, usually a single
   * frame.
   */
  poster?: VisualMedia[];

  /** Optional provider-specific metadata about the video. */
  metadata?: Record<string, unknown>;

  /** Optional attribution information about where the video came from. */
  attribution?: Attribution;

  /** Whether this video can be played on a cellular connection. */
  canAutoplayOnCellular?: boolean;

  /** The video duration in milliseconds. */
  duration?: number;
}

/**
 * An NPF iframe object.
 *
 * @see https://www.tumblr.com/docs/npf#embed-iframe-objects
 */
export interface IFrame {
  /** A URL used for constructing and embeddable video iframe. */
  url: string;

  /** The width of the video iframe */
  width: number;

  /** The height of the video iframe */
  height: number;
}

/**
 * Converts {@link block} to HTML.
 *
 * @category Content
 */
export function renderVideo(renderer: Renderer, block: VideoBlock): string {
  let result = `<figure class="${renderer.prefix}-block-video">`;
  if (block.media) {
    result +=
      '<video src="' + renderer.escape(block.media?.url ?? block.url!) + '"';
    if (block.poster) {
      result +=
        ' poster="' +
        renderer.escape(
          block.poster.reduce((biggest, current) =>
            biggest && biggest.width > current.width ? biggest : current
          ).url
        ) +
        '"';
    }
    result += '></video>';
  } else if (block.embedHtml) {
    result += block.embedHtml;
  } else if (block.embedIframe) {
    result +=
      `<iframe src="${renderer.escape(block.embedIframe.url)}"` +
      ` width="${block.embedIframe.width}"` +
      ` height="${block.embedIframe.height}"></iframe>`;
  } else if (block.embedUrl) {
    result += `<iframe src="${renderer.escape(block.embedUrl)}"></iframe>`;
  } else {
    result +=
      `<a href="${renderer.escape(block.url!)}">` +
      renderer.escape(block.url!) +
      '</a>';
  }

  if (block.attribution) {
    result +=
      '<figcaption>' +
      renderer.renderAttribution(block.attribution) +
      '</figcaption>';
  }
  result += '</figure>';
  return result;
}
