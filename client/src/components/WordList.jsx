import { useQuery, useMutation } from '@apollo/client';
import { VStack, Center, Spinner } from '@chakra-ui/react';
import WordCard from './WordCard';
import { DELETE_WORD_DOC, WORDS_QUERY } from '~/graphql';

import { equals } from 'ramda';

export default function WordList({ prefix = '', onDisplay = () => {}, onEdit = () => {} }) {
  const { data, loading, error } = useQuery(WORDS_QUERY, { variables: { prefix } });

  const [deleteWordDoc] = useMutation(DELETE_WORD_DOC, {
    update: (cache, { data: { deleteWordDoc } }) => {
      cache.modify({
        fields: {
          words: (existingWordDocs = [], { readField }) =>
            existingWordDocs.filter((docRef) => !equals(deleteWordDoc.id, readField('id', docRef))),
        },
      });
    },
  });

  return (
    <VStack align="stretch">
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        data.words.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onClick={() => onDisplay(word)}
            onEdit={() => onEdit(word)}
            onDelete={() => deleteWordDoc({ variables: { id: word.id } })}
          />
        ))
      )}
    </VStack>
  );
}
