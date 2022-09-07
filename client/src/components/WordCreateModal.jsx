import { useMutation, gql } from '@apollo/client';
import WordFormModal from './WordFormModal';
import { CREATE_WORD_DOC, WORDS_QUERY } from '~/graphql';
import { useNavigate } from 'react-router-dom';
import { AUTH_ERROR } from '../auth';
import { AUTH } from '../utils';
import { equals } from 'ramda';

export default function WordCreateModal({ disclosure }) {
  const navigate = useNavigate();
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
    onError: (error) => {
      if (equals(AUTH_ERROR.not_authorized, error.message)) {
        localStorage.removeItem(AUTH.tokens);
        navigate(`/login`);
      }
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
