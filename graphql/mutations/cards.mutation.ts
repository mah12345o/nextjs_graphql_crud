import { gql } from "@apollo/client";
import { CARD_FIELDS_FRAGMENT } from "../fragments/card.fragment";

export const CREATE_CARD = gql`
  mutation CreateCard($title: String!, $description: String!, $category: String) {
    createCard(title: $title, description: $description, category: $category) {
      ...CardFields
    }
  }
  ${CARD_FIELDS_FRAGMENT}
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $title: String, $description: String, $category: String) {
    updateCard(id: $id, title: $title, description: $description, category: $category) {
      ...CardFields
    }
  }
  ${CARD_FIELDS_FRAGMENT}
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;
