import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('with everything', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 100, height: 100}],
    alt_text: 'neat image',
    caption: 'this image is neat',
    attribution: {
      type: 'link',
      url: 'https://example.org/',
    },
  },
]);

snapshotNpf2Html('with nothing', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 100, height: 100}],
  },
]);

snapshotNpf2Html('with multiple media resolutions', [
  {
    type: 'image',
    media: [
      {url: 'https://example.org/image-small.jpg', width: 100, height: 100},
      {url: 'https://example.org/image-mid.jpg', width: 200, height: 200},
      {url: 'https://example.org/image-big.jpg', width: 400, height: 400},
    ],
  },
]);

snapshotNpf2Html('with only caption', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 100, height: 100}],
    caption: 'this image is neat',
  },
]);

snapshotNpf2Html('with only attribution', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 100, height: 100}],
    attribution: {
      type: 'link',
      url: 'https://example.org/',
    },
  },
]);

snapshotNpf2Html('HTML-escapes alt text', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 100, height: 100}],
    alt_text: '<"&>',
  },
]);

snapshotNpf2Html('HTML-escapes caption', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 100, height: 100}],
    caption: '<"&>',
  },
]);
