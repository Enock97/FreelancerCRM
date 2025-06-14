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
  mutation UpdateContact($id: ID!, $input: ContactInput!) {
    updateContact(id: $id, input: $input) {
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

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      id
      email
    }
  }
`;
