import { useState } from 'react';

import { createWord, deleteWord, updateWord } from '../sanity-api';
import { fetchingStatus } from '../utils';

export default function useWordOperation(word = null) {
  const [status, setStatus] = useState(fetchingStatus.init);

  const handleDeleteWord =
    ({ onSuccess = () => {}, onFail = () => {}, onFetching = () => {} }) =>
    async (word) => {
      try {
        onFetching();
        setStatus(fetchingStatus.loading);
        await deleteWord(word._id);
        setStatus(fetchingStatus.success);
        onSuccess();
      } catch (error) {
        setStatus(fetchingStatus.fail);
        onFail();
        console.error(error);
      }
    };

  const handleCreateWord =
    ({ onSuccess = () => {}, onFail = () => {}, onFetching = () => {} }) =>
    async (word) => {
      try {
        onFetching();
        setStatus(fetchingStatus.loading);
        await createWord(word);
        setStatus(fetchingStatus.success);
        onSuccess();
      } catch (error) {
        setStatus(fetchingStatus.fail);
        onFail();
        console.error(error);
      }
    };

  const handleUpdateWord =
    ({ onSuccess = () => {}, onFail = () => {}, onFetching = () => {} }) =>
    async (newWord) => {
      try {
        onFetching();
        setStatus(fetchingStatus.loading);
        await updateWord(word._id, newWord);
        setStatus(fetchingStatus.success);
        onSuccess();
      } catch (error) {
        setStatus(fetchingStatus.fail);
        onFail();
        console.error(error);
      }
    };

  return {
    status,
    handleCreateWord,
    handleDeleteWord,
    handleUpdateWord,
  };
}
