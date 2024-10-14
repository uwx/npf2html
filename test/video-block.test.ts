import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('prefers media to embed_html', [
  {
    type: 'video',
    media: {url: 'https://example.org/video.mp4', width: 200, height: 200},
    embed_html: '<marquee>total nonsense</marquee>',
  },
]);

snapshotNpf2Html('prefers embed_html to embed_iframe', [
  {
    type: 'video',
    embed_html: '<marquee>total nonsense</marquee>',
    embed_iframe: {
      url: 'https://example.org/iframe-embed',
      width: 200,
      height: 100,
    },
  },
]);

snapshotNpf2Html('prefers embed_iframe to embed_url', [
  {
    type: 'video',
    embed_iframe: {
      url: 'https://example.org/iframe-embed',
      width: 200,
      height: 100,
    },
    embed_url: 'https://example.org/iframe-url',
  },
]);

snapshotNpf2Html('prefers embed_url to url', [
  {
    type: 'video',
    embed_url: 'https://example.org/iframe-url',
    url: 'https://example.org/video.mp4',
  },
]);

snapshotNpf2Html('with url', [
  {
    type: 'video',
    url: 'https://example.org/video.mp4',
  },
]);

snapshotNpf2Html('with attribution', [
  {
    type: 'video',
    url: 'https://example.org/video.mp4',
    attribution: {
      type: 'blog',
      blog: {
        uuid: 'e23bdaeb-f31e-4dd3-b990-00f24ec7c16c',
        name: 'Example Blog',
        url: 'https://example.org/blog',
      },
    },
  },
]);

snapshotNpf2Html('with poster: one', [
  {
    type: 'video',
    url: 'https://example.org/video.mp4',
    poster: [{url: 'https://example.org/poster.jpg', width: 200, height: 200}],
  },
]);

snapshotNpf2Html('with poster: multiple', [
  {
    type: 'video',
    url: 'https://example.org/video.mp4',
    poster: [
      {url: 'https://example.org/poster-small.jpg', width: 200, height: 200},
      {url: 'https://example.org/poster-big.jpg', width: 400, height: 400},
    ],
  },
]);
