import {snapshotNpf2Html} from './utils';

snapshotNpf2Html(
  'truncate',
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
        truncate_after: 0,
      },
    ],
  }
);
