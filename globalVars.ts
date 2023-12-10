export const IS_TESTING = true;
export const ENGLISH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'] as const;
export const SYMBOLS = [
  "~",
  "->",
  "(",
  ")",
  "*",
  "v"
] as const;
export function structuredClone<TData>(val: any): TData{
  return JSON.parse(JSON.stringify(val));
} 