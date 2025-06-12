import { gql } from '@apollo/client';

export const CREATE_CONTACT = gql`
  mutation CreateContact($data: CreateContactInput!) {
    createContact(data: $data) {
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

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($data: UpdateContactInput!) {
    updateContact(data: $data) {
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

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: Int!) {
    deleteContact(id: $id)
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($data: CreateActivityInput!) {
    createActivity(data: $data) {
      id
      title
      note
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      email
    }
  }
`
