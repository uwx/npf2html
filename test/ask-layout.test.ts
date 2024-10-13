import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('single contents', [{type: 'text', text: 'text'}], {
  layout: [
    {
      type: 'ask',
      blocks: [0],
    },
  ],
});

snapshotNpf2Html('with attribution', [{type: 'text', text: 'text'}], {
  layout: [
    {
      type: 'ask',
      blocks: [0],
      attribution: {
        type: 'blog',
        blog: {
          uuid: 'e23bdaeb-f31e-4dd3-b990-00f24ec7c16c',
          name: 'Example Blog',
          url: 'https://example.org/blog',
        },
      },
    },
  ],
});

snapshotNpf2Html('with asking avatar', [{type: 'text', text: 'text'}], {
  layout: [{type: 'ask', blocks: [0]}],
  askingAvatar: [
    {url: 'https://example.org/photo.jpg', width: 150, height: 150},
  ],
});

snapshotNpf2Html(
  'between normal rows',
  [
    {type: 'text', text: 'first'},
    {type: 'text', text: 'second'},
    {type: 'text', text: 'third'},
  ],
  {
    layout: [{type: 'ask', blocks: [1]}],
  }
);

snapshotNpf2Html(
  'containing multiple rows',
  [
    {type: 'text', text: 'first'},
    {type: 'text', text: 'second'},
  ],
  {
    layout: [{type: 'ask', blocks: [0, 1]}],
  }
);
