import type {Attribution} from './attribution';
import type {Media, VisualMedia} from './media';

/**
 * An NPF audio type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-audio
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
  embed_html?: string;

  /** A URL to the embeddable content to use as an iframe. */
  embed_url?: string;

  /** Optional provider-specific metadata about the audio track. */
  metadata?: Record<string, unknown>;

  /** Optional attribution information about where the audio track came from. */
  attribution?: Attribution;
}
