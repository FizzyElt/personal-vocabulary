import fs from 'fs/promises';
import { head, equals, append, propEq, pipe, not, inc, modify, assoc, mergeRight } from 'ramda';
import Joi from 'joi';
import { generateWordFiles } from '../script';

export type WordDoc = {
  words: Word[];
};

export type Word = {
  word: string;
  translation: string;
  reviewCount: number;
  links: string[];
};

// word validation function
export const wordScheme = Joi.object<Word>({
  word: Joi.string().required(),
  translation: Joi.string().allow(''),
  links: Joi.array().items(Joi.string().domain()).required(),
});

const readWords = async (prefix: string) => {
  const content = await fs.readFile(`${__dirname}/words/${prefix}.json`, 'utf-8');

  const { words } = JSON.parse(content) as WordDoc;

  return words;
};

const writeWords = async (prefix: string, content: WordDoc) =>
  fs.writeFile(`${__dirname}/words/${prefix}.json`, JSON.stringify(content));

const isWordExist = (words: Word[], searchWord: string) => words.some(propEq('word', searchWord));

const increaseWordReviewCount = modify('reviewCount', inc);

class WordService {
  constructor() {}

  // add a new word to the service
  async add(wordData: Omit<Word, 'reviewCount'>) {
    const prefix = head(wordData.word).toUpperCase();

    const words = await readWords(prefix);

    if (!isWordExist(words, wordData.word)) {
      const newWord: Word = assoc('reviewCount', 1, wordData);
      const newWords = append(newWord, words);
      await writeWords(prefix, { words: newWords });
    }
  }

  // update a word in the service
  async update(newWord: Omit<Word, 'reviewCount'>) {
    const prefix = head(newWord.word).toUpperCase();

    const words = await readWords(prefix);

    if (!isWordExist(words, newWord.word)) return;

    const newWords = words.map((word) => {
      if (equals(word.word, newWord.word)) {
        return pipe(mergeRight(word), increaseWordReviewCount)(newWord);
      }
      return word;
    });

    await writeWords(prefix, { words: newWords });
  }

  // delete word
  async delete(word: string) {
    const prefix = head(word).toUpperCase();

    const words = await readWords(prefix);

    const newWords = words.filter(pipe(propEq('word', word), not));

    await writeWords(prefix, { words: newWords });
  }

  // increase reviewCount of word
  async increaseReviewCount(incWord: string) {
    const prefix = head(incWord).toUpperCase();

    const words = await readWords(prefix);

    const newWords = words.map((word) =>
      equals(word.word, incWord) ? increaseWordReviewCount(word) : word
    );

    await writeWords(prefix, { words: newWords });
  }

  // get words by prefix
  async getWords(prefix: string): Promise<Word[]> {
    return readWords(prefix);
  }

  async getAllWords(): Promise<Word[]> {
    const dirPath = `${__dirname}/words`;
    const files = await fs.readdir(dirPath);

    const contents = await Promise.all(
      files.map((fileName) => {
        const filePath = `${dirPath}/${fileName}`;
        return fs.readFile(filePath, 'utf-8');
      })
    );

    const words = contents.flatMap((content) => (JSON.parse(content) as WordDoc).words);

    return words;
  }
}

generateWordFiles(`${__dirname}/words`);

export default new WordService();
