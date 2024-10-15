import {Attribution, renderAttribution} from './attribution';
import {VisualMedia, renderImageMedia} from './media';
import {RenderOptions} from './options';
import {escapeHtml} from './utils';

/**
 * An NPF image type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-image
 */
export interface ImageBlock {
  type: 'image';

  /**
   * An array of {@link VisualMedia} objects which represent different available
   * sizes of this image asset.
   */
  media: VisualMedia[];

  /** Colors used in the image. */
  colors?: Record<string, string>;

  /** A feedback token to use when this image block is a GIF Search result. */
  feedback_token?: string;

  /**
   * For GIFs, this is a single-frame "poster".
   *
   * @see https://www.tumblr.com/docs/npf#gif-posters
   */
  poster?: VisualMedia;

  /** @see https://www.tumblr.com/docs/npf#attributions */
  attribution?: Attribution;

  /** Text used to describe the image, for screen readers. */
  alt_text?: string;

  /** A caption typically shown under the image. */
  caption?: string;
}

/** Converts {@link block} to HTML. */
export function renderImage(block: ImageBlock, options: RenderOptions): string {
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
