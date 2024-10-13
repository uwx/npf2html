import {snapshotNpf2Html} from './utils';

snapshotNpf2Html(
  'single-line rows',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
  ],
  {
    layout: [
      {
        type: 'rows',
        display: [{blocks: [0]}, {blocks: [1]}, {blocks: [2]}],
      },
    ],
  }
);

// Real rows can only contain images, but we test text instead for simplicity

snapshotNpf2Html(
  'one big row',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
  ],
  {
    layout: [
      {
        type: 'rows',
        display: [{blocks: [0, 1, 2]}],
      },
    ],
  }
);

snapshotNpf2Html(
  'mixed rows',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
    {type: 'text', text: 'four'},
    {type: 'text', text: 'five'},
  ],
  {
    layout: [
      {
        type: 'rows',
        display: [{blocks: [0, 1]}, {blocks: [2]}, {blocks: [3, 4]}],
      },
    ],
  }
);

snapshotNpf2Html(
  'carousel',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
  ],
  {
    layout: [
      {
        type: 'rows',
        display: [{blocks: [0, 1], mode: {type: 'carousel'}}],
      },
    ],
  }
);
