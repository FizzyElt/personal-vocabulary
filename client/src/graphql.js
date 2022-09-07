import { gql } from '@apollo/client';

export const WORDS_QUERY = gql`
  query GetWords($prefix: String) {
    words(prefix: $prefix) {
      id
      word
      prefix
      translation
      review_count
      links
    }
  }
`;

export const CREATE_WORD_DOC = gql`
  mutation CreateWordDoc($word: WordDocCreateInput!) {
    createWordDoc(word: $word) {
      id
      word
      prefix
      review_count
      translation
      links
    }
  }
`;

export const UPDATE_WORD_DOC = gql`
  mutation UpdateWordDoc($id: ID!, $word: WordDocUpdateInput!) {
    updateWordDoc(id: $id, word: $word) {
      id
      word
      prefix
      review_count
      translation
      links
    }
  }
`;

export const DELETE_WORD_DOC = gql`
  mutation DeleteWordDoc($id: ID!) {
    deleteWordDoc(id: $id) {
      id
      word
      prefix
      review_count
      translation
      links
    }
  }
`;

export const INCREASE_REVIEW_COUNT = gql`
  mutation IncreaseReviewCount($id: ID!) {
    increaseWordReviewCount(id: $id) {
      id
      word
      prefix
      review_count
      translation
      links
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email:String!,$password:String!){
    login(email:$email,password:$password){
      token
      user{
        id,
        name
        email
      }
    }
  }
`