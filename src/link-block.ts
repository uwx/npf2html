import type {VisualMedia} from './media';

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
  poster?: VisualMedia;
}
