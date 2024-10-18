import {VisualMedia} from './media';
import {Renderer} from './renderer';

/**
 * An NPF link type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-link
 *
 * @category Content
 */
export interface LinkBlock {
  type: 'link';

  /** The URL to use for the link block. */
  url: string;

  /** The title of where the link goes. */
  title?: string;

  /** The description of where the link goes. */
  description?: string;

  /** The author of the link's content. */
  author?: string;

  /** The name of the site being linked to. */
  site_name?: string;

  display_url?: string;

  /** An image media object to use as a "poster" for the link. */
  poster?: VisualMedia[];
}

/**
 * Convets {@link block} to HTML.
 *
 * @category Content
 */
export function renderLink(renderer: Renderer, block: LinkBlock): string {
  let result =
    `<a class="${renderer.prefix}-block-link"` +
    ` href="${renderer.escape(block.url)}">`;
  if (block.poster) {
    result += renderer.renderImageMedia(block.poster);
  }
  result +=
    '<h2>' +
    renderer.escape(block.title ?? block.display_url ?? block.url) +
    '</h2>';
  if (block.site_name) {
    result +=
      `<p class="${renderer.prefix}-block-link-site">` +
      `${renderer.escape(block.site_name)}</p>`;
  }
  if (block.author) {
    result +=
      `<p class="${renderer.prefix}-block-link-author">` +
      `${renderer.escape(block.author)}</p>`;
  }
  if (block.description) {
    result +=
      `<p class="${renderer.prefix}-block-link-description">` +
      `${renderer.escape(block.description)}</p>`;
  }
  result += '</a>';
  return result;
}
