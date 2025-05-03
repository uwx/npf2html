## 1.1.7

* Fix a bug where adjacent inline formatting spans could produce invalid HTML
  and duplicated text.

* Improve the HTML output for adjacent inline formatting spans.

## 1.1.6

* Generate links for image blocks.

## 1.1.5

* Fix ESM support.

## 1.1.4

* No user-visible changes.

## 1.1.3

* No user-visible changes.

## 1.1.2

* No user-visible changes.

## 1.1.1

* No user-visible changes.

## 1.1.0

* Export `ImageBlock`, `LinkBlock`, `PollAnswer`, and `PollSettings` types.

* Stop generating `srcset`s for images. Without knowing the desired size,
  there's no way to know when not to use the highest-resolution option or which
  option to choose instead.

* Fix `package.exports`.

## 1.0.0

* Initial release.
