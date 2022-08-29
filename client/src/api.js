import axios from 'axios';

const wordInstance = axios.create({
  baseURL: '/api/',
});

export const getAllWords = async () => wordInstance.get('words');

export const getWordsByPrefix = async (prefix) =>
  wordInstance.get('words', {
    params: {
      prefix: prefix,
    },
  });

export const postNewWord = async (word) => {
  wordInstance.post('words', { word });
};

export const putWord = async (word) => wordInstance.put('words', { word });

export const deleteWord = async (word) => wordInstance.delete(`words/${word}`);

export const increaseReviewCount = async (word) =>
  wordInstance.patch(`words/${word}`, { action: 'increaseReviewCount' });
