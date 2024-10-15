import {escapeHtml} from './utils';
import {RenderOptions} from './options';

/**
 * An NPF media object.
 *
 * @see https://www.tumblr.com/docs/npf#media-objects
 */
export interface Media {
  /** The canonical URL of the media asset. */
  url: string;

  /**
   * The MIME type of the media asset, or a best approximation will be made
   * based on the given URL.
   */
  type?: string;
}

/** An image or video media object. */
export interface VisualMedia extends Media {
  /**
   * The width of the media asset, if that makes sense (for images and videos,
   * but not for audio).
   */
  width: number;

  /**
   * The height of the media asset, if that makes sense (for images and videos,
   * but not for audio).
   */
  height: number;

  /**
   * For display purposes, this indicates whether the dimensions are defaults.
   */
  original_dimensions_missing?: boolean;

  /**
   * This indicates whether this media object is a cropped version of the
   * original media.
   */
  cropped?: boolean;

  /**
   * This indicates whether this media object has the same dimensions as the
   * original media
   */
  has_original_dimensions?: boolean;
}

/** Converts {@link media} to HTML. */
export function renderImageMedia(
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
