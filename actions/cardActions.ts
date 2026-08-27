"use server";

import { revalidatePath } from "next/cache";
import { graphql } from "graphql";
import { schema, resolvers } from "@/lib/graphql/schema";

export interface CreateCardInput {
  title: string;
  description: string;
  category?: string;
}

export interface UpdateCardInput {
  id: string;
  title?: string;
  description?: string;
  category?: string;
}

// 1. Create Card Server Action
export async function createCardAction(input: CreateCardInput) {
  const query = `
    mutation CreateCard($title: String!, $description: String!, $category: String) {
      createCard(title: $title, description: $description, category: $category) {
        id
        title
        description
        category
      }
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    rootValue: resolvers,
    variableValues: input as Record<string, any>,
  });

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  revalidatePath("/");
  return JSON.parse(JSON.stringify(result.data?.createCard));
}

// 2. Update Card Server Action
export async function updateCardAction(input: UpdateCardInput) {
  const query = `
    mutation UpdateCard($id: ID!, $title: String, $description: String, $category: String) {
      updateCard(id: $id, title: $title, description: $description, category: $category) {
        id
        title
        description
        category
      }
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    rootValue: resolvers,
    variableValues: input as Record<string, any>,
  });

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  revalidatePath("/");
  return JSON.parse(JSON.stringify(result.data?.updateCard));
}

// 3. Delete Card Server Action
export async function deleteCardAction(id: string) {
  const query = `
    mutation DeleteCard($id: ID!) {
      deleteCard(id: $id)
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    rootValue: resolvers,
    variableValues: { id },
  });

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  revalidatePath("/");
  return JSON.parse(JSON.stringify(result.data?.deleteCard));
}
