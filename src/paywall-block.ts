/**
 * An NPF paywall type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-paywall
 */
export type PaywallBlock = PaywallBlockCta | PaywallBlockDivider;

/** The shared base class for {@link PaywallBlock} */
interface PaywallBlockBase {
  type: 'paywall';

  /** The paywall block design. */
  subtype: 'cta' | 'divider' | 'disabled';

  /** The creator profile url this paywall should link to. */
  url: string;

  /** Whether this paywall block is actually visible, default to true. */
  is_visible?: boolean;
}

/** A CTA (unpaid) or disabled paywall block. */
export interface PaywallBlockCta extends PaywallBlockBase {
  subtype: 'cta' | 'disabled';

  /** The CTA title that appears above the main text. */
  title: string;

  /** The main description text. */
  text: string;
}

/** A paywall block that appears as a divider. */
export interface PaywallBlockDivider extends PaywallBlockBase {
  subtype: 'divider';

  /** The label text. */
  text: string;

  /** The hex color for the label and divider, e.g. `#eeeeee`. */
  color?: string;
}
