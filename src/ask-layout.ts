import {BlogAttribution} from './attribution';
import {renderImageMedia} from './media';
import {RenderOptions} from './options';
import {escapeHtml} from './utils';

/**
 * Content blocks that are part of an ask.
 *
 * @see https://www.tumblr.com/docs/npf#layout-block-type-ask
 */
export interface AskLayout {
  type: 'ask';

  /** An array of block indices that are a part of the ask content of the Post. */
  blocks: number[];

  /**
   * If the ask is not anonymous, this will include information about the blog
   * that submitted the ask.
   */
  attribution?: BlogAttribution;
}

/** Wraps {@link html} as an ask. */
export function renderAskLayout(
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
