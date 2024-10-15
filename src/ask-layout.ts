import {BlogAttribution} from './attribution';
import {Renderer} from './renderer';

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
  renderer: Renderer,
  layout: AskLayout,
  html: string
): string {
  let result = `<div class="${renderer.prefix}-layout-ask">`;
  if (layout.attribution) {
    result += `<a href="${renderer.escape(layout.attribution.blog.url)}">`;
  } else {
    // Always wrap the avatar in an A tag even if there's nothing to link to to
    // make it easier to style consistently.
    result += '<a>';
  }
  result +=
    renderer.renderImageMedia(renderer.askingAvatar) +
    '</a><figure><figcaption>';
  if (layout.attribution) {
    result += `<a href="${renderer.escape(layout.attribution.blog.url)}">`;
  }
  result +=
    '<strong>' +
    renderer.escape(layout.attribution?.blog?.name ?? 'Anonymous') +
    '</strong> asked:';
  if (layout.attribution) result += '</a>';
  result += '</figcaption>' + html + '</figure></div>';
  return result;
}
