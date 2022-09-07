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

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String
    user: User
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
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

export default typeDefs;
