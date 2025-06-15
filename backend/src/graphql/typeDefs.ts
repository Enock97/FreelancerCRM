import { gql } from "graphql-tag";

const typeDefs = gql`
  enum Status {
    NY
    OPPFOLGING
    KUNDE
    ARKIVERT
  }

  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
    company: String
    status: Status!
    note: String
    createdAt: String!
    activities: [Activity!]!
  }

  type Activity {
    id: ID!
    description: String!
    createdAt: String!
    contact: Contact!
  }

  input ContactInput {
    name: String!
    email: String!
    phone: String
    company: String
    status: Status
    note: String
  }

  input UpdateUserInput {
    email: String
    password: String
  }

  type User {
    id: ID!
    email: String!
    contacts: [Contact!]!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    contacts: [Contact!]!
    me: User
  }

  type Mutation {
    createContact(input: ContactInput!): Contact!
    updateContact(id: ID!, input: ContactInput!): Contact!
    deleteContact(id: ID!): Boolean!

    createActivity(contactId: ID!, description: String!): Activity!
    deleteActivity(id: ID!): Boolean!

    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!): AuthPayload!
    updateProfile(input: UpdateUserInput!): User!
  }
`;

export default typeDefs;
