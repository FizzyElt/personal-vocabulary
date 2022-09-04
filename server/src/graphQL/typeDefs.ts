import { gql } from 'apollo-server';

const typeDefs = gql`
  type WordDoc {
    id: ID!
    word: String!
    prefix: String!
    review_count: Int!
    translation: String!
    links: [String!]!
  }

  type Query {
    words: [WordDoc]
  }

  input WordDocInput {
    word: String!
    translation: String!
    links: [String!]!
  }

  type Mutation {
    createWordDoc(word: WordDocInput): WordDoc!
    updateWordDoc(id: ID!, word: WordDocInput): WordDoc!
    deleteWordDoc(id: ID!): WordDoc!
  }
`;

export default typeDefs;
