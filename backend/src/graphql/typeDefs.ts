import gql from 'graphql-tag';

const typeDefs = gql`
  enum ContactStatus {
    VENTER_PA_SVAR
    I_SAMTALE
    TENKER_PA_DET
    AVKLART
  }

  type Contact {
    id: Int!
    name: String!
    email: String!
    phone: String
    company: String
    status: ContactStatus
    note: String
    createdAt: String!
  }

  input ContactInput {
    name: String!
    email: String!
    phone: String
    company: String
    status: ContactStatus
    note: String
  }

  input ContactUpdateInput {
    id: Int!
    name: String
    email: String
    phone: String
    company: String
    status: ContactStatus
    note: String
  }

  type Activity {
    id: Int!
    title: String!
    note: String
    createdAt: String!
    contactId: Int!
  }

  input ActivityInput {
    title: String!
    note: String
    contactId: Int!
  }

  type StatusCount {
    status: String!
    count: Int!
  }

  type DashboardData {
    totalContacts: Int!
    totalActivities: Int!
    statusCounts: [StatusCount!]!
  }

  type Query {
    contacts: [Contact!]!
    contact(id: Int!): Contact
    activities(contactId: Int!): [Activity!]!
    dashboard: DashboardData!
  }

  type Mutation {
    createContact(data: ContactInput!): Contact!
    updateContact(data: ContactUpdateInput!): Contact!
    deleteContact(id: Int!): Boolean!
    createActivity(data: ActivityInput!): Activity!
  }
`;

export default typeDefs;
