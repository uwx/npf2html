import test from 'ava';
import * as npf from '../src';
import npf2html from '../src';
import * as beautify from 'simply-beautiful';

/**
 * Declares a test with the given {@link description} that runs
 * `npf2html(blocks, options)` and snapshots the result for testing.
 */
function snapshotNpf2Html(
  description: string,
  blocks: npf.ContentBlock[],
  options?: npf.Options
): void {
  test(description, t => t.snapshot(beautify.html(npf2html(blocks, options))));
}

snapshotNpf2Html('audio with media: with everything', [
  {
    type: 'audio',
    media: [{url: 'https://example.org/song.mp3'}],
    title: 'A Neat Song',
    artist: 'A Neat Singer',
    album: 'A Neat Record',
    poster: [
      {
        url: 'https://example.org/poster.jpg',
        width: 150,
        height: 150,
      },
    ],
    attribution: {
      type: 'link',
      url: 'https://example.org/',
    },
  },
]);

snapshotNpf2Html('audio with media: with nothing', [
  {
    type: 'audio',
    media: [{url: 'https://example.org/song.mp3'}],
  },
]);

snapshotNpf2Html('audio with media: with title only', [
  {
    type: 'audio',
    media: [{url: 'https://example.org/song.mp3'}],
    title: 'A Neat Song',
  },
]);

snapshotNpf2Html('audio with media: with artist only', [
  {
    type: 'audio',
    media: [{url: 'https://example.org/song.mp3'}],
    artist: 'A Neat Singer',
  },
]);

snapshotNpf2Html('audio with media: with album only', [
  {
    type: 'audio',
    media: [{url: 'https://example.org/song.mp3'}],
    album: 'A Neat Record',
  },
]);

snapshotNpf2Html('audio with media: with title and album', [
  {
    type: 'audio',
    media: [{url: 'https://example.org/song.mp3'}],
    title: 'A Neat Song',
    album: 'A Neat Record',
  },
]);
