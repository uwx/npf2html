import {AskLayout, renderAskLayout} from './ask-layout';
import {AudioBlock, renderAudio} from './audio-block';
import {ImageBlock, renderImage} from './image-block';
import {LinkBlock, renderLink} from './link-block';
import {VisualMedia} from './media';
import {Options, RenderOptions} from './options';
import {PaywallBlock, renderPaywall} from './paywall-block';
import {PollBlock, renderPoll} from './poll-block';
import {
  RowsDisplay,
  RowsLayout,
  renderRowLayout,
  renderTruncateLayout,
} from './rows-layout';
import {
  TextBlock,
  TextBlockIndented,
  renderTextNoIndent,
  renderTextIndented,
} from './text-block';
import {escapeHtml} from './utils';
import {VideoBlock, renderVideo} from './video-block';

export {AskLayout} from './ask-layout';
export {
  Attribution,
  PostAttribution,
  Post,
  LinkAttribution,
  BlogAttribution,
  AppAttribution,
} from './attribution';
export {AudioBlock} from './audio-block';
export {BlogInfo} from './blog-info';
export {Media, VisualMedia} from './media';
export {Options} from './options';
export {PollBlock} from './poll-block';
export {
  PaywallBlock,
  PaywallBlockCta,
  PaywallBlockDivider,
} from './paywall-block';
export {RowsDisplay, RowsLayout} from './rows-layout';
export {TextBlock, TextBlockNoIndent, TextBlockIndented} from './text-block';
export {
  InlineFormat,
  InlineFormatBasic,
  InlineFormatLink,
  InlineFormatMention,
  InlineFormatColor,
} from './inline-format';
export {VideoBlock, IFrame} from './video-block';

/**
 * A single discrete unit of content.
 *
 * @see https://www.tumblr.com/docs/npf#content-blocks
 */
export type ContentBlock =
  | AudioBlock
  | ImageBlock
  | LinkBlock
  | PaywallBlock
  | PollBlock
  | TextBlock
  | VideoBlock;

/**
 * A layout indicating how to lay out contents blocks.
 *
 * @see https://www.tumblr.com/docs/npf#layout-blocks
 */
export type Layout = AskLayout | RowsLayout;

/**
 * An interface for layouts that apply to specific adjacent groups of content
 * blocks that *aren't* just rendered as individual rows.
 */
interface LayoutGroup {
  /** The layout describing how to render this group. */
  layout: AskLayout | RowsDisplay;

  /** The inclusive block index on which the group starts. */
  start: number;

  /** The exclusive block index before which the group ends. */
  end: number;
}

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

/** Returns whether {@link block} is a {@link TextBlockIndented}. */
function isTextBlockIndented(block: ContentBlock): block is TextBlockIndented {
  return (
    block.type === 'text' &&
    (block.subtype === 'indented' ||
      block.subtype === 'ordered-list-item' ||
      block.subtype === 'unordered-list-item')
  );
}

/**
 * If {@link options} includes layouts, this returns a list of {@link
 * LayoutGroup}s that indicate non-default layouts, ordered by start index.
 *
 * This assumes that all {@link LayoutGroup}s are contiguous and
 * non-overlapping.
 */
function buildLayoutGroups(options?: Options): LayoutGroup[] {
  const result: Array<AskLayout | RowsDisplay> = [];
  for (const layout of options?.layout ?? []) {
    if (layout.type === 'ask') {
      result.push(layout);
    } else {
      for (const display of layout.display) {
        if (display.blocks.length === 1) continue;
        result.push(display);
      }
    }
  }

  return result
    .map(layout => ({
      layout,
      start: Math.min(...layout.blocks),
      end: Math.max(...layout.blocks) + 1,
    }))
    .sort((a, b) => a.start - b.start);
}

/**
 * Converts each NPF block in {@link blocks} to plain HTML and concatenates them
 * into a single string.
 */
export default function npf2html(
  blocks: ContentBlock[],
  options?: Options
): string {
  const renderOptions: RenderOptions = {
    prefix: options?.prefix ?? 'npf',
    askingAvatar: options?.askingAvatar ?? anonymousAvatar,
  };
  let result = '';

  const truncateAfter = options?.layout?.find(
    layout => layout.type === 'rows'
  )?.truncate_after;
  let truncateIndex: number | undefined;

  const layoutGroups = buildLayoutGroups(options);

  // HTML contents of the current `layoutGroup`, if there is one.
  let currentGroup = '';

  for (let i = 0; i < blocks.length; i++) {
    // Consumes all elements within a indented text block and renders them to a
    // string.
    const collectAndRenderIndented = (): string => {
      const first = blocks[i] as TextBlockIndented;
      const indentation = first.indent_level ?? 0;
      const blocksAndNested: [
        TextBlockIndented,
        ...Array<TextBlockIndented | string>,
      ] = [first];

      while (i < blocks.length - 1) {
        const sibling = blocks[i + 1];
        if (!isTextBlockIndented(sibling)) break;
        const siblingIndentation = sibling.indent_level ?? 0;
        if (siblingIndentation < indentation) break;
        if (siblingIndentation === indentation) {
          if (sibling.subtype !== first.subtype) break;
          i++;
          blocksAndNested.push(sibling);
        } else {
          i++;
          blocksAndNested.push(collectAndRenderIndented());
        }
      }

      return renderTextIndented(blocksAndNested, renderOptions);
    };

    let blockResult: string;
    const block = blocks[i];
    switch (block.type) {
      case 'audio':
        blockResult = renderAudio(block, renderOptions);
        break;

      case 'image':
        blockResult = renderImage(block, renderOptions);
        break;

      case 'link':
        blockResult = renderLink(block, renderOptions);
        break;

      case 'paywall':
        blockResult = renderPaywall(block, renderOptions);
        break;

      case 'poll':
        blockResult = renderPoll(block, renderOptions);
        break;

      case 'video':
        blockResult = renderVideo(block, renderOptions);
        break;

      case 'text':
        if (isTextBlockIndented(block)) {
          blockResult = collectAndRenderIndented();
        } else {
          blockResult = renderTextNoIndent(block, renderOptions);
        }
        break;

      default:
        blockResult =
          '<p color="font-weight: bold; color: red">Unknown block type ' +
          `"${escapeHtml((block as {type: string}).type)}"!</p>`;
    }

    const group = layoutGroups[0];
    if (group && i >= group.start) {
      currentGroup += blockResult;

      if (i + 1 === group.end) {
        layoutGroups.shift();
        if ('type' in group.layout) {
          result += renderAskLayout(group.layout, currentGroup, renderOptions);
        } else {
          result += renderRowLayout(group.layout, currentGroup, renderOptions);
        }
        currentGroup = '';
      }
    } else {
      result += blockResult;
    }

    if (i === truncateAfter) {
      truncateIndex = result.length;
    }
  }

  if (truncateIndex !== undefined) {
    result =
      result.substring(0, truncateIndex) +
      renderTruncateLayout(result.substring(truncateIndex), renderOptions);
  }

  return result;
}
