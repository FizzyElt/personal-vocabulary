import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
import WordDisplayModal from '~/components/WordDisplayModal';
import WordCreateModal from '~/components/WordCreateModal';
import WordUpdateModal from '~/components/WordUpdateModal';
import WordList from '~/components/WordList';

import { charList } from './utils';

import { pipe, tap } from 'ramda';

import { AddIcon } from '@chakra-ui/icons';

function App() {
  const wordCreateClosure = useDisclosure();
  const wordDetailClosure = useDisclosure();
  const wordEditClosure = useDisclosure();

  const [prefix, setPrefix] = useState('');
  const [word, setWord] = useState(null);

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

            <WordList
              prefix={prefix}
              onDisplay={pipe(tap(wordDetailClosure.onOpen), setWord)}
              onEdit={pipe(tap(wordEditClosure.onOpen), setWord)}
            />
          </VStack>
        </Container>
      </Box>

      <WordCreateModal disclosure={wordCreateClosure} />

      <WordUpdateModal word={word} disclosure={wordEditClosure} />

      <WordDisplayModal
        isOpen={wordDetailClosure.isOpen}
        onClose={wordDetailClosure.onClose}
        word={word}
      />
    </>
  );
}

export default App;
