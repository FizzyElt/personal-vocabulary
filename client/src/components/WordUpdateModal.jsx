import { useMutation } from '@apollo/client';
import WordFormModal from './WordFormModal';
import { UPDATE_WORD_DOC } from '~/graphql';

import { pick, dissoc } from 'ramda';

export default function WordUpdateModal({ disclosure, word = null }) {
  const [updateWordDoc, { data, loading, error }] = useMutation(UPDATE_WORD_DOC, {
    onCompleted: disclosure.onClose,
  });

  return (
    <WordFormModal
      mode="edit"
      isOpen={disclosure.isOpen}
      defaultFormData={word ? pick(['word', 'translation', 'links'], word) : undefined}
      loading={loading}
      onClose={disclosure.onClose}
      onSubmit={(newWord) =>
        updateWordDoc({ variables: { id: word.id, word: dissoc('word', newWord) } })
      }
    />
  );
}
