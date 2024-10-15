import {RenderOptions} from './options';
import {escapeHtml} from './utils';

/**
 * An NPF poll type content block.
 *
 * This is not an officially-documented block type, so its documentation is
 * best-effort.
 */
export interface PollBlock {
  type: 'poll';

  /** The UUID for this poll. */
  client_id: string;

  /** The question this poll is answering. */
  question: string;

  /** The possible answers for the poll. */
  answers: PollAnswer[];

  /** The settings for creating this poll. */
  settings: PollSettings;

  /** A string representation of the moment this poll was created. */
  created_at: string;

  /**
   * The number of *seconds* (not milliseconds) since the epoch at which this
   * poll was created.
   */
  timestamp: number;
}

/** One possible answer to a poll. */
export interface PollAnswer {
  /** The UUID for this answer. */
  client_id: string;

  /** The text describing this answer. */
  answer_text: string;
}

/** The settings used to create this poll. */
export interface PollSettings {
  /** Whether the poll allows multiple choices. */
  multiple_choice: boolean;

  /**
   * Meaning unclear.
   *
   * This seems to be `"closed-after"` whether the poll is open or closed.
   */
  close_status: string;

  /** The number of seconds after the poll's creation that it expires. */
  expire_after: number;

  /** The name of the app that created the poll. Usually "tumblr". */
  source: string;
}

/** Converts {@link block} to HTML. */
export function renderPoll(block: PollBlock, options: RenderOptions): string {
  let result =
    `<div class="${options.prefix}-block-poll">` +
    `<h2>${escapeHtml(block.question)}</h2><ul>`;
  for (const answer of block.answers) {
    result += `<li>${escapeHtml(answer.answer_text)}</li>`;
  }
  result += '</ul></div>';
  return result;
}
