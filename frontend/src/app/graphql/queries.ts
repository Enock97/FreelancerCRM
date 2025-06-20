import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      name
      email
      phone
      company
      status
      order
      note
      createdAt
      activities {
        id
        description
        createdAt
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query GetProfile {
  me {
    id
    email
    contacts {
      id
      activities {
        id
      }
    }
  }
  }
`;
