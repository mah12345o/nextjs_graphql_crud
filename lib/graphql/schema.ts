import { buildSchema, graphql } from "graphql";

export interface Card {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

// In-memory Card Store
let cardsStore: Card[] = [
  {
    id: "1",
    title: "GraphQL Query Basics",
    description: "Learn how to ask for exact fields from a single GraphQL endpoint.",
    category: "Basics",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Apollo Client Setup",
    description: "Connect Next.js frontend with ApolloProvider and InMemoryCache.",
    category: "Client",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "GraphQL Mutations",
    description: "Execute Create, Update, and Delete operations on the server.",
    category: "Mutations",
    createdAt: new Date().toISOString(),
  },
];

export const typeDefs = `
  type Card {
    id: ID!
    title: String!
    description: String!
    category: String!
    createdAt: String!
  }

  type Query {
    cards: [Card!]!
    card(id: ID!): Card
  }

  type Mutation {
    createCard(title: String!, description: String!, category: String): Card!
    updateCard(id: ID!, title: String, description: String, category: String): Card!
    deleteCard(id: ID!): Boolean!
  }
`;

export const schema = buildSchema(typeDefs);

export const resolvers = {
  cards: () => cardsStore,

  card: ({ id }: { id: string }) => {
    return cardsStore.find((c) => c.id === id) || null;
  },

  createCard: ({ title, description, category = "General" }: { title: string; description: string; category?: string }) => {
    const newCard: Card = {
      id: String(Date.now()),
      title,
      description,
      category,
      createdAt: new Date().toISOString(),
    };
    cardsStore.unshift(newCard);
    return newCard;
  },

  updateCard: ({ id, title, description, category }: { id: string; title?: string; description?: string; category?: string }) => {
    const index = cardsStore.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Card with ID ${id} not found`);
    }
    const updated: Card = {
      ...cardsStore[index],
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
    };
    cardsStore[index] = updated;
    return updated;
  },

  deleteCard: ({ id }: { id: string }) => {
    const initialLen = cardsStore.length;
    cardsStore = cardsStore.filter((c) => c.id !== id);
    return cardsStore.length < initialLen;
  },
};
