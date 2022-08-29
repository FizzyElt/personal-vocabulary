import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  Flex,
  Spacer,
  Select,
  useDisclosure,
  HStack,
  Button,
} from '@chakra-ui/react';
import WordCard from '~/components/WordCard';
import WordFormModal from '~/components/WordFormModal';
import WordDisplayModal from '~/components/WordDisplayModal';

import { isEmpty, dissoc } from 'ramda';
import { getAllWords, getWordsByPrefix, postNewWord, putWord, deleteWord } from './api';
import { AddIcon } from '@chakra-ui/icons';

const charList = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

function App() {
  const [words, setWords] = useState([]);
  const [prefix, setPrefix] = useState('');
  const [word, setWord] = useState(null);

  const wordCreateClosure = useDisclosure();
  const wordDetailClosure = useDisclosure();
  const wordEditClosure = useDisclosure();

  const handleGetWords = useCallback(async (prefix) => {
    try {
      if (isEmpty(prefix)) {
        const res = await getAllWords();
        const data = res.data;
        setWords(data.words);
        return;
      }

      const res = await getWordsByPrefix(prefix);
      const data = res.data;
      setWords(data.words);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    handleGetWords(prefix);
  }, [prefix]);

  const handleDeleteWord = async (word) => {
    try {
      await deleteWord(word);

      // refetch data
      await handleGetWords(prefix);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateWord = async (word) => {
    try {
      await postNewWord(word);
      wordCreateClosure.onClose();
      // refetch data
      await handleGetWords(prefix);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateWord = async (word) => {
    try {
      await putWord(word);
      wordEditClosure.onClose();
      // refetch data
      await handleGetWords(prefix);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box>
        <Container>
          <VStack align="stretch">
            <Flex>
              <HStack w="full">
                <Select value={prefix} onChange={(e) => setPrefix(e.target.value)}>
                  <option value={''}>All</option>
                  {charList.map((char) => (
                    <option key={char} value={char}>
                      {char}
                    </option>
                  ))}
                </Select>
                <Button onClick={wordCreateClosure.onOpen} leftIcon={<AddIcon />}>
                  New
                </Button>
              </HStack>
            </Flex>
            <VStack align="stretch">
              {words.map((word) => (
                <WordCard
                  key={word.word}
                  word={word}
                  onClick={() => {
                    wordDetailClosure.onOpen();
                    setWord(word);
                  }}
                  onEdit={() => {
                    wordEditClosure.onOpen();
                    setWord(word);
                  }}
                  onDelete={() => handleDeleteWord(word.word)}
                />
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>
      <WordFormModal
        isOpen={wordEditClosure.isOpen}
        onClose={wordEditClosure.onClose}
        defaultFormData={dissoc('reviewCount', word)}
        onSubmit={handleUpdateWord}
      />

      <WordFormModal
        isOpen={wordCreateClosure.isOpen}
        onClose={wordCreateClosure.onClose}
        onSubmit={handleCreateWord}
      />

      <WordDisplayModal
        isOpen={wordDetailClosure.isOpen}
        onClose={wordDetailClosure.onClose}
        word={word}
      />
    </>
  );
}

export default App;
