import { gql } from "@apollo/client";
import { CARD_FIELDS_FRAGMENT } from "../fragments/card.fragment";

export const GET_CARDS = gql`
  query GetCards {
    cards {
      ...CardFields
    }
  }
  ${CARD_FIELDS_FRAGMENT}
`;

export const GET_CARD_BY_ID = gql`
  query GetCardById($id: ID!) {
    card(id: $id) {
      ...CardFields
    }
  }
  ${CARD_FIELDS_FRAGMENT}
`;
