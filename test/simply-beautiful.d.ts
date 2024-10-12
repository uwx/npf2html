// We have to use this because Prettier doesn't support real HTML without
// self-closing tags and htmlfy removes whitespace without any option to disable
// it.
declare module 'simply-beautiful' {
  export function html(html: string): string;
}
