import {en_1024_words_6_chars_ed4_20200910} from "./word-lists/en_1024_words_6_chars_ed4_20200910";
import * as Exceptions from "./exceptions";
import * as WordLists from "./word-lists";

interface PasswordLengthOptions {
  wordsNeeded?: number,
  bitsNeeded?: number
}

/**
 * Turn a byte array into a word list.  The first parameter is a word list
 * and the second (optional) parameter can shorten the list of words so
 * that it hits a threshold of `w` words `{wordsNeeded: <w>}` or at least
 * `l` bits `{bitsNeeded: `w`}`.  Note that bitsNeeded is a request for
 * a minimum number of bits, and more may be used if the requirement falls
 * off of a word boundary and more bits are available to ensure that the
 * final word is chosen from the full set of possibilities.
 * 
 * If the secret isn't long enough to provide wordsNeeded words or bitsNeeded
 * bits, the longest set of words possible from the secret will be returned.
 * (It will not throw an error.)
 *
 * @param wordListOfLengthPowerOf2 An array of 2^b words.
 */
const secretToWords = (
  wordListOfLengthPowerOf2: string[],
  secret: Uint8Array,
  options: PasswordLengthOptions = {}
): string[] => {
    const bitsPerWord = Math.round(Math.log2(wordListOfLengthPowerOf2.length));
    var {wordsNeeded, bitsNeeded} = options;
    if (typeof wordsNeeded !== "number") {
      if (typeof bitsNeeded != "number") {
        bitsNeeded = secret.length * 8;
      }
      wordsNeeded = Math.ceil(bitsNeeded / bitsPerWord);
    }
    const secretRemaining = [...secret];
    var byte: number = 0;
    var bitsLeftInByte = 0;
    var wordIndex = 0;
    var bitsNeededForWordIndex = bitsPerWord;
    const wordsGenerated: string[] = [];
    while (wordsGenerated.length < wordsNeeded) {
      // We still need more words
      if (bitsLeftInByte === 0) {
        // The byte we were copying over into words is empty. Grab another.
        if (secretRemaining.length == 0) {
          // we're out of bits.
          break;
        }
        byte = secretRemaining.shift()!;
        bitsLeftInByte = 8;
      }
      const numBitsToCopy = Math.min(bitsLeftInByte, bitsNeededForWordIndex);
      // If we're only copying part of the byte, copy high-order bits and
      // shift the remaining bits to the right.  (Shift any bits that
      const bitsToCopy = (byte >> (bitsLeftInByte - numBitsToCopy));
      bitsLeftInByte -= numBitsToCopy;
      byte = byte & (0xff >> (8-bitsLeftInByte));
      // shift any value already in the word index left of the bits to copy in
      // so that the numBitsToCopy bits on the right will be 0
      wordIndex = (wordIndex << numBitsToCopy);
      // Add the copied bits into the low-order bits of the word index.
      wordIndex += bitsToCopy;
      // We now need that many fewer bits to complete the word index
      bitsNeededForWordIndex -= numBitsToCopy;
      // See if we've completed a word
      if (bitsNeededForWordIndex === 0) {
        // We've completed a word.  Push it onto the completed list of words
        wordsGenerated.push(wordListOfLengthPowerOf2[wordIndex]);
        // Start a new word index, which is empty, needs bitsPerWordsBits
        wordIndex = 0;
        bitsNeededForWordIndex = bitsPerWord;
      }
    }
    if (bitsNeededForWordIndex < bitsPerWord && wordsGenerated.length < wordsNeeded) {
      // We were in the middle of generating a word when we ran out of bits.
      // We still had enough bits to add a word, so we'll use it.
      wordsGenerated.push(wordListOfLengthPowerOf2[wordIndex]);
    }
    return wordsGenerated;
  }

  /**
 * Turn a byte array into a word list.  The first parameter is a word list
 * and the second (optional) parameter can shorten the list of words so
 * that it hits a threshold of `w` words `{
 * wordsNeeded: <w>}` or at least
 * `l` bits `{bitsNeeded: `w`}`.  Note that bitsNeeded is a request for
 * a minimum number of bits, and more may be used if the requirement falls
 * off of a word boundary and more bits are available to ensure that the
 * final word is chosen from the full set of possibilities.
 * 
 * If the secret isn't long enough to provide wordsNeeded words or bitsNeeded
 * bits, the longest set of words possible from the secret will be returned.
 * (It will not throw an error.)
 */
// export const secretTo10BitWords = (
//   secret: Uint8Array,
//   options: PasswordLengthOptions = {}
// ) => secretToWords(en_1024_words_6_chars_ed4_20200910, secret, options);

export const secretToPasswordArray = (
  secret: Uint8Array,
  wordListName: WordLists.WordListName,
  options: PasswordLengthOptions = {}
) => {
  if (!(wordListName in WordLists.All)) {
    throw new Exceptions.WordListNotFound(wordListName);
  }
  return secretToWords(WordLists.All[wordListName], secret, options);
}

export const secretToPasswordWithSpacesBetweenWords: (
  secret: Uint8Array,
  wordListName: WordLists.WordListName,
  options?: PasswordLengthOptions
) => string = (...args) => secretToPasswordArray(...args).join(" ");

export const secretToPasswordWithCapitalizedWords: (
  secret: Uint8Array,
  wordListName: WordLists.WordListName,
  options?: PasswordLengthOptions
) => string = (...args) => secretToPasswordArray(...args)
  .map( word => word[0].toLocaleUpperCase() + word.substr(1))
  .join("");

export const secretToPasswordWithCapitalizedWordsDigitAndSymbol: (
  secret: Uint8Array,
  wordListName: WordLists.WordListName,
  options?: PasswordLengthOptions
) => string = (...args) => secretToPasswordWithCapitalizedWords(...args) + "4!"

