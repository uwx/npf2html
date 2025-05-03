import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('bold', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'bold', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('italic', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'italic', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('strikethrough', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'strikethrough', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('small', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'small', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('link', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {type: 'link', start: 7, end: 11, url: 'https://example.org/link'},
    ],
  },
]);

snapshotNpf2Html('mention', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {
        type: 'mention',
        start: 7,
        end: 11,
        blog: {
          uuid: 'e23bdaeb-f31e-4dd3-b990-00f24ec7c16c',
          name: 'Example Blog',
          url: 'https://example.org/blog',
        },
      },
    ],
  },
]);

snapshotNpf2Html('color', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'color', start: 7, end: 11, hex: '#0000ff'}],
  },
]);

snapshotNpf2Html('covering the whole text', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'bold', start: 0, end: 16}],
  },
]);

snapshotNpf2Html('multiple', [
  {
    type: 'text',
    text: 'bold italic strikethrough',
    formatting: [
      {type: 'bold', start: 0, end: 4},
      {type: 'strikethrough', start: 12, end: 25},
      {type: 'italic', start: 5, end: 11},
    ],
  },
]);

snapshotNpf2Html('nested', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {type: 'bold', start: 0, end: 16},
      {type: 'strikethrough', start: 7, end: 11},
      {type: 'italic', start: 12, end: 16},
    ],
  },
]);

snapshotNpf2Html('overlapping', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {type: 'bold', start: 0, end: 11},
      {type: 'strikethrough', start: 7, end: 16},
    ],
  },
]);

snapshotNpf2Html('HTML-escapes nested formatting once', [
  {
    type: 'text',
    text: 'format t<"&>s text',
    formatting: [
      {type: 'bold', start: 0, end: 18},
      {type: 'strikethrough', start: 7, end: 13},
      {type: 'italic', start: 8, end: 12},
    ],
  },
]);

// Regression test for #1
snapshotNpf2Html('adjacent and overlapping', [
  {
    type: 'text',
    text: 'before [left][right] after',
    formatting: [
      {
        type: 'bold',
        start: 7,
        end: 13,
      },
      {
        type: 'italic',
        start: 13,
        end: 20,
      },
      {
        type: 'bold',
        start: 13,
        end: 30,
      },
    ],
  },
]);
