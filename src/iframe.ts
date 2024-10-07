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
