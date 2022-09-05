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
    words(prefix: String): [WordDoc]
  }

  input WordDocCreateInput {
    word: String!
    translation: String!
    links: [String!]!
  }

  input WordDocUpdateInput {
    translation: String!
    links: [String!]!
  }

  type Mutation {
    createWordDoc(word: WordDocCreateInput): WordDoc!
    updateWordDoc(id: ID!, word: WordDocUpdateInput): WordDoc!
    deleteWordDoc(id: ID!): WordDoc!
    increaseWordReviewCount(id: ID!): WordDoc!
  }
`;

export default typeDefs;
