import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('single', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 150, height: 150}],
  },
]);

snapshotNpf2Html('multiple scales: square', [
  {
    type: 'image',
    media: [
      {url: 'https://example.org/image-small.jpg', width: 50, height: 50},
      {url: 'https://example.org/image-mid.jpg', width: 100, height: 100},
      {url: 'https://example.org/image-big.jpg', width: 200, height: 200},
      {
        url: 'https://example.org/image-non-integer.jpg',
        width: 60,
        height: 60,
      },
    ],
  },
]);

snapshotNpf2Html('multiple scales: landscape', [
  {
    type: 'image',
    media: [
      {url: 'https://example.org/image.jpg', width: 200, height: 100},
      {url: 'https://example.org/image.jpg', width: 400, height: 200},
    ],
  },
]);

snapshotNpf2Html('multiple scales: portrait', [
  {
    type: 'image',
    media: [
      {url: 'https://example.org/image.jpg', width: 100, height: 200},
      {url: 'https://example.org/image.jpg', width: 200, height: 400},
    ],
  },
]);
