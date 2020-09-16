// import {en_1024_words_5_chars_max_20200709} from "./en_1024_words_5_chars_max_20200709";
// import {en_1024_words_6_chars_ed4_20200910} from './en_1024_words_6_chars_ed4_20200910';
import {EN_512_5_chars_4_min_edit_distance_20200916} from "./en_512_words_5_chars_max_ed4_20200916";
import {EN_1024_6_chars_4_min_edit_distance_20200916} from './en_1024_words_6_chars_max_ed4_20200916';

// export * from "./en_1024_words_5_chars_max_20200709";
// export * from './en_1024_words_6_chars_ed4_20200910';
export * from "./en_512_words_5_chars_max_ed4_20200916";
export * from './en_1024_words_6_chars_max_ed4_20200916';

export const All = {
  EN_1024_6_chars_4_min_edit_distance_20200916,
  EN_512_5_chars_4_min_edit_distance_20200916,
} as const;
export type WordListName = keyof typeof All;
