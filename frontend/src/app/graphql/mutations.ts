import { gql } from "@apollo/client";

export const CREATE_CONTACT = gql`
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      id
      name
      email
      phone
      company
      status
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

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $input: ContactUpdateInput!) {
    updateContact(id: $id, input: $input) {
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
      activities {
        id
        description
        createdAt
      }
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($contactId: ID!, $description: String!) {
    createActivity(contactId: $contactId, description: $description) {
      id
      description
      createdAt
    }
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
    }
  }
`;

// Kanban drag/drop update
export const UPDATE_CONTACT_STATUS_AND_ORDER = gql`
  mutation UpdateContactStatusAndOrder($id: ID!, $status: Status!, $order: Int!) {
    updateContactStatusAndOrder(id: $id, status: $status, order: $order) {
      id
      status
      order
    }
  }
`;

// Profile update
export const UPDATE_CURRENT_USER = gql`
  mutation UpdateCurrentUser($email: String, $password: String) {
    updateCurrentUser(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const REORDER_CONTACTS = gql`
  mutation ReorderContacts($input: [ContactOrderInput!]!) {
    reorderContacts(input: $input)
  }
`;