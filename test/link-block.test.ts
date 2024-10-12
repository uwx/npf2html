import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('with everything', [
  {
    type: 'link',
    url: 'https://example.org/link',
    title: 'Cool Site',
    site_name: 'Example Site',
    author: 'Neat Writer',
    description: 'this site is so cool',
    poster: [
      {
        url: 'https://example.org/poster.jpg',
        width: 150,
        height: 150,
      },
    ],
  },
]);

snapshotNpf2Html('with nothing', [
  {
    type: 'link',
    url: 'https://example.org/link',
  },
]);

snapshotNpf2Html('prefers display_url to url', [
  {
    type: 'link',
    url: 'https://example.org/link',
    display_url: 'example.org',
  },
]);

snapshotNpf2Html('prefers title to display_url', [
  {
    type: 'link',
    url: 'https://example.org/link',
    title: 'Example Site',
    display_url: 'example.org',
  },
]);

snapshotNpf2Html('escapes HTML in URL', [
  {
    type: 'link',
    url: 'https://example.org/link?param&other',
  },
]);

snapshotNpf2Html('escapes HTML in title', [
  {
    type: 'link',
    url: 'https://example.org/link',
    title: '<"&>',
  },
]);

snapshotNpf2Html('escapes HTML in description', [
  {
    type: 'link',
    url: 'https://example.org/link',
    description: '<"&>',
  },
]);

snapshotNpf2Html('escapes HTML in author', [
  {
    type: 'link',
    url: 'https://example.org/link',
    author: '<"&>',
  },
]);

snapshotNpf2Html('escapes HTML in site_name', [
  {
    type: 'link',
    url: 'https://example.org/link',
    site_name: '<"&>',
  },
]);

snapshotNpf2Html('escapes HTML in display_url', [
  {
    type: 'link',
    url: 'https://example.org/link',
    display_url: '<"&>',
  },
]);
