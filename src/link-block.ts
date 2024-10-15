import {VisualMedia, renderImageMedia} from './media';
import {RenderOptions} from './options';
import {escapeHtml} from './utils';

/**
 * An NPF link type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-link
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

/** Convets {@link block} to HTML. */
export function renderLink(block: LinkBlock, options: RenderOptions): string {
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
