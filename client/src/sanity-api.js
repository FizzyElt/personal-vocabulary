import sanityClient from '@sanity/client';
import { head } from 'ramda';

const client = sanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-06-07',
  token: import.meta.env.VITE_SANITY_TOKEN,
});

export const wordsSubscription = () =>
  client.listen('*[_type == "word_doc"]{_id, word, translation, review_count, prefix, links}');

export const getAllWords = () =>
  client.fetch('*[_type == "word_doc"]{_id, word, translation, review_count, prefix, links}');

export const getWordsByPrefix = (prefix) =>
  client.fetch(
    '*[_type == "word_doc" && prefix == $prefix]{_id, word, translation, review_count, prefix, links}',
    { prefix }
  );

export const createWord = (wordDoc) =>
  client.create({
    _type: 'word_doc',
    ...wordDoc,
    review_count: 1,
    prefix: head(wordDoc.word).toUpperCase(),
  });

export const updateWord = (wordID, newWord) =>
  client
    .patch(wordID)
    .set({ ...newWord, prefix: head(newWord.word).toUpperCase() })
    .commit();

export const increaseReviewCount = (wordID) =>
  client.patch(wordID).inc({ review_count: 1 }).commit();

export const deleteWord = (wordID) => client.delete(wordID);
