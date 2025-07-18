import {Renderer} from './renderer.js';

/**
 * An NPF poll type content block.
 *
 * This is not an officially-documented block type, so its documentation is
 * best-effort.
 *
 * @category Content
 */
export interface PollBlock {
  type: 'poll';

  /** The UUID for this poll. */
  clientId: string;

  /** The question this poll is answering. */
  question: string;

  /** The possible answers for the poll. */
  answers: PollAnswer[];

  /** The settings for creating this poll. */
  settings: PollSettings;

  /** A string representation of the moment this poll was created. */
  createdAt: string;

  /**
   * The number of *seconds* (not milliseconds) since the epoch at which this
   * poll was created.
   */
  timestamp: number;
}

/**
 * One possible answer to a poll.
 *
 * @category Content
 */
export interface PollAnswer {
  /** The UUID for this answer. */
  clientId: string;

  /** The text describing this answer. */
  answerText: string;
}

/**
 * The settings used to create this poll.
 *
 * @category Content
 */
export interface PollSettings {
  /** Whether the poll allows multiple choices. */
  multipleChoice: boolean;

  /**
   * Meaning unclear.
   *
   * This seems to be `"closed-after"` whether the poll is open or closed.
   */
  closeStatus: string;

  /** The number of seconds after the poll's creation that it expires. */
  expireAfter: number;

  /** The name of the app that created the poll. Usually "tumblr". */
  source: string;
}

/**
 * Converts {@link block} to HTML.
 *
 * @category Content
 */
export function renderPoll(renderer: Renderer, block: PollBlock): string {
  let result =
    `<div class="${renderer.prefix}-block-poll">` +
    `<h2>${renderer.escape(block.question)}</h2><ul>`;
  for (const answer of block.answers) {
    result += `<li>${renderer.escape(answer.answerText)}</li>`;
  }
  result += '</ul></div>';
  return result;
}
