import {en_1024_words_5_chars_max_20200709} from "./en_1024_words_5_chars_max_20200709";
import {en_1024_words_6_chars_ed4_20200910} from './en_1024_words_6_chars_ed4_20200910';

export * from "./en_1024_words_5_chars_max_20200709";
export * from './en_1024_words_6_chars_ed4_20200910';

export const All = {
  en_1024_words_5_chars_max_20200709,
  en_1024_words_6_chars_ed4_20200910
} as const;
export type WordListName = keyof typeof All;
