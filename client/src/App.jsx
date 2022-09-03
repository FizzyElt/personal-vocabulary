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
  Spinner,
  Center,
} from '@chakra-ui/react';
import WordCard from '~/components/WordCard';
import WordFormModal from '~/components/WordFormModal';
import WordDisplayModal from '~/components/WordDisplayModal';

import useWords from '~/hooks/useWords';
import useWordOperation from '~/hooks/useWordOperation';

import { isEmpty, dissoc, omit, equals } from 'ramda';

import { charList, fetchingStatus } from './utils';

import { AddIcon } from '@chakra-ui/icons';

const isLoading = equals(fetchingStatus.loading);

function App() {
  const [prefix, setPrefix] = useState('');
  const [word, setWord] = useState(null);

  const { words, status } = useWords(prefix);
  const {
    status: operationStatus,
    handleCreateWord,
    handleDeleteWord,
    handleUpdateWord,
  } = useWordOperation(word);

  const wordCreateClosure = useDisclosure();
  const wordDetailClosure = useDisclosure();
  const wordEditClosure = useDisclosure();

  return (
    <>
      <Box p={4}>
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

            {/** words list */}
            <VStack align="stretch">
              {isLoading(status) ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                words.map((word) => (
                  <WordCard
                    key={word._id}
                    word={word}
                    onClick={() => {
                      wordDetailClosure.onOpen();
                      setWord(word);
                    }}
                    onEdit={() => {
                      wordEditClosure.onOpen();
                      setWord(word);
                    }}
                    onDelete={() => handleDeleteWord(word)}
                  />
                ))
              )}
            </VStack>
          </VStack>
        </Container>
      </Box>

      <WordFormModal
        isOpen={wordEditClosure.isOpen}
        loading={isLoading(operationStatus)}
        onClose={wordEditClosure.onClose}
        defaultFormData={omit(['review_count', '_id', 'prefix'], word)}
        onSubmit={handleUpdateWord({ onSuccess: wordEditClosure.onClose })}
      />

      <WordFormModal
        isOpen={wordCreateClosure.isOpen}
        loading={isLoading(operationStatus)}
        onClose={wordCreateClosure.onClose}
        onSubmit={handleCreateWord({ onSuccess: wordCreateClosure.onClose })}
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
