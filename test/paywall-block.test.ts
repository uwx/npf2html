import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('cta', [
  {
    type: 'paywall',
    subtype: 'cta',
    url: 'https://example.org/creator',
    title: 'Pay Me',
    text: 'give me money please',
  },
]);

snapshotNpf2Html('disabled', [
  {
    type: 'paywall',
    subtype: 'disabled',
    url: 'https://example.org/creator',
    title: 'Pay Me',
    text: 'give me money please',
  },
]);

snapshotNpf2Html('invisible', [
  {
    type: 'paywall',
    subtype: 'cta',
    url: 'https://example.org/creator',
    title: 'Pay Me',
    text: 'give me money please',
    is_visible: false,
  },
]);

snapshotNpf2Html('divider: no color', [
  {
    type: 'paywall',
    subtype: 'divider',
    url: 'https://example.org/creator',
    text: 'thanks for the money',
  },
]);

snapshotNpf2Html('divider: color', [
  {
    type: 'paywall',
    subtype: 'divider',
    url: 'https://example.org/creator',
    text: 'thanks for the money',
    color: '#0000ff',
  },
]);

snapshotNpf2Html('HTML-escapes title', [
  {
    type: 'paywall',
    subtype: 'cta',
    url: 'https://example.org/creator',
    title: '<&">',
    text: 'give me money please',
  },
]);

snapshotNpf2Html('HTML-escapes text', [
  {
    type: 'paywall',
    subtype: 'cta',
    url: 'https://example.org/creator',
    title: 'Pay Me',
    text: '<&">',
  },
]);
