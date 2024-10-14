import type {Attribution} from './attribution';
import type {VisualMedia} from './media';

/**
 * An NPF video type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-video
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
  embed_html?: string;

  /** An {@link IFrame} used for constructing video iframes. */
  embed_iframe?: IFrame;

  /** A URL to the embeddable content to use as an iframe. */
  embed_url?: string;

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
  can_autoplay_on_cellular?: boolean;

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
