import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('heading1', [
  {
    type: 'text',
    subtype: 'heading1',
    text: 'some text',
  },
]);

snapshotNpf2Html('heading2', [
  {
    type: 'text',
    subtype: 'heading2',
    text: 'some text',
  },
]);

snapshotNpf2Html('quirky', [
  {
    type: 'text',
    subtype: 'quirky',
    text: 'some text',
  },
]);

snapshotNpf2Html('quote', [
  {
    type: 'text',
    subtype: 'quote',
    text: 'some text',
  },
]);

snapshotNpf2Html('chat', [
  {
    type: 'text',
    subtype: 'chat',
    text: 'some text',
  },
]);

snapshotNpf2Html('no subtype', [
  {
    type: 'text',
    text: 'some text',
  },
]);

snapshotNpf2Html('HTML-escapes text', [
  {
    type: 'text',
    text: '<"&>',
  },
]);

snapshotNpf2Html('indented: alone', [
  {
    type: 'text',
    text: 'before',
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'middle',
  },
  {
    type: 'text',
    text: 'after',
  },
]);

snapshotNpf2Html('indented: flat', [
  {
    type: 'text',
    subtype: 'indented',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'second',
  },
]);

snapshotNpf2Html('indented: in and out', [
  {
    type: 'text',
    subtype: 'indented',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'base',
  },
]);

snapshotNpf2Html('indented: deep', [
  {
    type: 'text',
    subtype: 'indented',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'third',
    indent_level: 2,
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'fourth',
    indent_level: 3,
  },
]);

snapshotNpf2Html('ordered-list-item: alone', [
  {
    type: 'text',
    text: 'before',
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'middle',
  },
  {
    type: 'text',
    text: 'after',
  },
]);

snapshotNpf2Html('ordered-list-item: flat', [
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'second',
  },
]);

snapshotNpf2Html('ordered-list-item: in and out', [
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'base',
  },
]);

snapshotNpf2Html('ordered-list-item: deep', [
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'third',
    indent_level: 2,
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'fourth',
    indent_level: 3,
  },
]);

snapshotNpf2Html('unordered-list-item: alone', [
  {
    type: 'text',
    text: 'before',
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'middle',
  },
  {
    type: 'text',
    text: 'after',
  },
]);

snapshotNpf2Html('unordered-list-item: flat', [
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'second',
  },
]);

snapshotNpf2Html('unordered-list-item: in and out', [
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'base',
  },
]);

snapshotNpf2Html('unordered-list-item: deep', [
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'third',
    indent_level: 2,
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'fourth',
    indent_level: 3,
  },
]);

snapshotNpf2Html('mixed indented', [
  {
    type: 'text',
    subtype: 'indented',
    text: 'first',
  },
  {
    type: 'text',
    subtype: 'unordered-list-item',
    text: 'second',
    indent_level: 1,
  },
  {
    type: 'text',
    subtype: 'ordered-list-item',
    text: 'third',
    indent_level: 2,
  },
  {
    type: 'text',
    subtype: 'indented',
    text: 'fourth',
    indent_level: 3,
  },
]);
