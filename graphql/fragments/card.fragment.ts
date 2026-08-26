import { gql } from "@apollo/client";

export const CARD_FIELDS_FRAGMENT = gql`
  fragment CardFields on Card {
    id
    title
    description
    category
    createdAt
  }
`;
