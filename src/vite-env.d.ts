/// <reference types="vite/client" />

// @fontsource 등 패키지 하위 CSS 사이드이펙트 import 허용
declare module '*.css';

interface FileSystemDirectoryHandle {
  readonly name: string;
  readonly kind: 'directory';
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  values(): AsyncIterableIterator<FileSystemHandle>;
  [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
}
interface FileSystemHandle {
  readonly name: string;
  readonly kind: 'file' | 'directory';
}
interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  getFile(): Promise<File>;
}
interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}
