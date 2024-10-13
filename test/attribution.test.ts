import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('post', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 150, height: 150}],
    attribution: {
      type: 'post',
      url: 'https://example.org/post',
      post: {id: '1234567'},
      blog: {
        uuid: 'e23bdaeb-f31e-4dd3-b990-00f24ec7c16c',
        name: 'Example Blog',
        url: 'https://example.org/blog',
      },
    },
  },
]);

snapshotNpf2Html('link', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 150, height: 150}],
    attribution: {
      type: 'link',
      url: 'https://example.org/link',
    },
  },
]);

snapshotNpf2Html('blog', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 150, height: 150}],
    attribution: {
      type: 'blog',
      blog: {
        uuid: 'e23bdaeb-f31e-4dd3-b990-00f24ec7c16c',
        name: 'Example Blog',
        url: 'https://example.org/',
      },
    },
  },
]);

snapshotNpf2Html('app with all properties', [
  {
    type: 'image',
    media: [{url: 'https://example.org/image.jpg', width: 150, height: 150}],
    attribution: {
      type: 'app',
      url: 'https://example.org/link',
      app_name: 'Neat App',
      display_text: 'Created in Some App',
      logo: {url: 'https://example.org/logo.jpg', width: 150, height: 150},
    },
  },
]);
