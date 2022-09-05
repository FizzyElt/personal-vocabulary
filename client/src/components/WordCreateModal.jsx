import { useMutation, gql } from '@apollo/client';
import WordFormModal from './WordFormModal';
import { CREATE_WORD_DOC, WORDS_QUERY } from '~/graphql';

export default function WordCreateModal({ disclosure }) {
  const [createWordDoc, { data, loading, error }] = useMutation(CREATE_WORD_DOC, {
    onCompleted: disclosure.onClose,
    update: (cache, { data: { createWordDoc } }) => {
      cache.modify({
        fields: {
          words: (existingWordDocs = [], { toReference }) => {
            const newWordDocRef = toReference(createWordDoc);
            return [newWordDocRef, ...existingWordDocs];
          },
        },
      });
    },
  });

  return (
    <WordFormModal
      mode="create"
      isOpen={disclosure.isOpen}
      loading={loading}
      onClose={disclosure.onClose}
      onSubmit={(word) => createWordDoc({ variables: { word } })}
    />
  );
}
