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
export const OVERLAY_OPACITY = .55
export const BORDER_RADIUS_NUM = 15;
export const SUCCESS_COLOR = "#28A745";
export const WARNING_COLOR = "#FFC12F";
export const PRIMARY_COLOR = "#0069D9";
export const APP_NAME = "Logica";
export function structuredClone<TData>(val: any): TData {
  return JSON.parse(JSON.stringify(val));
};

export const TESTING_USER_ID = "1234";