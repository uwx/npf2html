import type { Options } from './options.js';
import {type AskLayout, renderAskLayout} from './ask-layout.js';
import {type Attribution, renderAttribution} from './attribution.js';
import {type AudioBlock, renderAudio} from './audio-block.js';
import {type ImageBlock, renderImage} from './image-block.js';
import type { UnknownBlock } from './index.js';
import {type InlineFormat, formatText, renderInlineFormat} from './inline-format.js';
import {type LinkBlock, renderLink} from './link-block.js';
import {type VisualMedia, renderImageMedia} from './media.js';
import {type PaywallBlock, renderPaywall} from './paywall-block.js';
import {type PollBlock, renderPoll} from './poll-block.js';
import {
  type RowsDisplay,
  renderRowLayout,
  renderTruncateLayout,
} from './rows-layout.js';
import {
  type TextBlockIndented,
  type TextBlockNoIndent,
  renderTextNoIndent,
  renderTextIndented,
} from './text-block.js';
import {type VideoBlock, renderVideo} from './video-block.js';

/** The media for the default avatar to use for asks if none is provided. */
const anonymousAvatar: VisualMedia[] = [
  {
    width: 128,
    height: 128,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_128.gif',
  },
  {
    width: 96,
    height: 96,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_96.gif',
  },
  {
    width: 64,
    height: 64,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_64.gif',
  },
  {
    width: 48,
    height: 48,
    url: 'https://assets.tumblr.com/images/anonymous_avatar_48.gif',
  },
];

/**
 * A class that stores materialized options for rendering NPF to HTML.
 *
 * Callers may extend this class and override any of its `render*()` methods to
 * change the way particular NPF components are rendered.
 *
 * @category Main
 */
export class Renderer {
  /** @see Options.prefix */
  readonly prefix: string;

  /** @see Options.askingAvatar */
  readonly askingAvatar: VisualMedia[];

  constructor(options?: Options) {
    this.prefix = options?.prefix ?? 'npf';
    this.askingAvatar = options?.askingAvatar ?? anonymousAvatar;
  }

  /**
   * Escapes all characters in {@link text} that aren't safe to use literally in
   * HTML text or attributes.
   */
  escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /** HTML-escapes {@link text} and formats it according to {@link formatting}. */
  formatText(text: string, formatting: InlineFormat[] | undefined): string {
    return formatText(this, text, formatting);
  }

  /** Wraps {@link html} as an ask. */
  renderAskLayout(layout: AskLayout, html: string): string {
    return renderAskLayout(this, layout, html);
  }

  /** Converts {@link attribution} to HTML. */
  renderAttribution(attribution: Attribution): string {
    return renderAttribution(this, attribution);
  }

  /** Converts {@link block} to HTML. */
  renderAudio(block: AudioBlock): string {
    return renderAudio(this, block);
  }

  /** Converts {@link block} to HTML. */
  renderImage(block: ImageBlock): string {
    return renderImage(this, block);
  }

  /**
   * Applies the formatting specified by {@link format} to {@link html}, which may
   * already include nested formatting.
   *
   * The {@link html} has already been trimmed to only the section to which
   * {@link format} applies.
   */
  renderInlineFormat(html: string, format: InlineFormat): string {
    return renderInlineFormat(this, html, format);
  }

  /**
   * Converts {@link media} to HTML.
   *
   * @param options.alt - The alt text for the media.
   */
  renderImageMedia(media: VisualMedia[], options?: {alt?: string}): string {
    return renderImageMedia(this, media, options);
  }

  /** Converts {@link block} to HTML. */
  renderLink(block: LinkBlock): string {
    return renderLink(this, block);
  }

  /** Converts {@link block} to HTML. */
  renderPaywall(block: PaywallBlock): string {
    return renderPaywall(this, block);
  }

  /** Converts {@link block} to HTML. */
  renderPoll(block: PollBlock): string {
    return renderPoll(this, block);
  }

  /** Wraps {@link html} as single row. */
  renderRowLayout(display: RowsDisplay, html: string): string {
    return renderRowLayout(this, display, html);
  }

  /** Converts {@link block} to HTML. */
  renderTextNoIndent(block: TextBlockNoIndent): string {
    return renderTextNoIndent(this, block);
  }

  /**
   * Converts {@link blocksAndNested} to HTML.
   *
   * The first element of {@link blocksAndNested} determines the subtype of the
   * entire thing; any other blocks are guaranteed to have the same subtype. The
   * string elements of {@link blocksAndNested} ar {@link TextBlockIndented}
   * objects which are more deeply nested and have already been converted to
   * HTML.
   */
  renderTextIndented(
    blocksAndNested: [TextBlockIndented, ...Array<TextBlockIndented | string>]
  ): string {
    return renderTextIndented(this, blocksAndNested);
  }

  /** Renders {@link html} as a "below the fold" read more. */
  renderTruncateLayout(html: string): string {
    return renderTruncateLayout(this, html);
  }

  /** Renders {@link block} as HTML. */
  renderUnknown(block: UnknownBlock): string {
    return (
      '<p color="font-weight: bold; color: red">Unknown block type ' +
      `"${this.escape((block as {type: string}).type)}"!</p>`
    );
  }

  /** Converts {@link block} to HTML. */
  renderVideo(block: VideoBlock): string {
    return renderVideo(this, block);
  }
}
