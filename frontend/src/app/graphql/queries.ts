import { gql } from '@apollo/client';

export const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      name
      email
      phone
      company
      status
      note
      createdAt
    }
  }
`;

export const GET_ACTIVITIES = gql`
  query GetActivities($contactId: Int!) {
    activities(contactId: $contactId) {
      id
      title
      note
      createdAt
    }
  }
`;
