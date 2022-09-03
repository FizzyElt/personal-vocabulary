import { useState, useCallback, useEffect } from 'react';

import { getAllWords, getWordsByPrefix, wordsSubscription } from '../sanity-api';
import { fetchingStatus } from '../utils';

export default function useWords(prefix = '') {
  const [words, setWords] = useState([]);
  const [status, setStatus] = useState(fetchingStatus.init);

  const handleGetWords = useCallback(async () => {
    try {
      setStatus(fetchingStatus.loading);
      if (prefix) {
        const res = await getWordsByPrefix(prefix);
        setWords(res);
        setStatus(fetchingStatus.success);
        return;
      }
      const res = await getAllWords();
      setWords(res);
      setStatus(fetchingStatus.success);
    } catch (error) {
      setStatus(fetchingStatus.fail);
      console.log(error);
    }
  }, [prefix]);

  useEffect(() => {
    handleGetWords();
  }, [handleGetWords]);

  useEffect(() => {
    const subscribed = wordsSubscription().subscribe((words) => {
      handleGetWords();
    });

    return () => {
      subscribed.unsubscribe();
    };
  }, [handleGetWords]);

  return {
    words,
    status,
  };
}
