import { useMutation } from '@apollo/client';
import WordFormModal from './WordFormModal';
import { UPDATE_WORD_DOC } from '~/graphql';

import { pick, dissoc, equals } from 'ramda';

import { useNavigate } from 'react-router-dom';
import { AUTH_ERROR } from '../auth';
import { AUTH } from '../utils';

export default function WordUpdateModal({ disclosure, word = null }) {
  const navigate = useNavigate();
  const [updateWordDoc, { data, loading, error }] = useMutation(UPDATE_WORD_DOC, {
    onCompleted: disclosure.onClose,
    onError: (error) => {
      if (equals(AUTH_ERROR.not_authorized, error.message)) {
        localStorage.removeItem(AUTH.tokens);
        navigate(`/login`);
      }
    },
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
