import { gql } from "graphql-tag";

const typeDefs = gql`
  enum Status {
    NEW
    FOLLOW_UP
    CUSTOMER
    ARCHIVED
  }

  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
    company: String
    status: Status!
    order: Int!
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
    status: Status!
    order: Int!
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
    activities: [Activity!]!
  }

  type Mutation {
    createContact(input: ContactInput!): Contact!
    updateContact(id: ID!, input: ContactInput!): Contact!
    deleteContact(id: ID!): Boolean!

    createActivity(contactId: ID!, description: String!): Activity!
    deleteActivity(id: ID!): Boolean!

    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!): AuthPayload!
    
    updateContactStatusAndOrder(id: ID!, status: Status!, order: Int!): Contact
    updateCurrentUser(email: String, password: String): User
  }
`;

export default typeDefs;
