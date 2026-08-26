import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CARDS } from "@/graphql/queries/cards.query";
import { CREATE_CARD, UPDATE_CARD, DELETE_CARD } from "@/graphql/mutations/cards.mutation";
import { Card } from "@/lib/graphql/schema";

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

export function useCards() {
  const { data, loading, error, refetch } = useQuery<{ cards: Card[] }>(GET_CARDS, {
    fetchPolicy: "cache-and-network",
  });

  const [createCardMutation, { loading: creating }] = useMutation(CREATE_CARD, {
    onCompleted: () => refetch(),
  });

  const [updateCardMutation, { loading: updating }] = useMutation(UPDATE_CARD, {
    onCompleted: () => refetch(),
  });

  const [deleteCardMutation, { loading: deleting }] = useMutation(DELETE_CARD, {
    onCompleted: () => refetch(),
  });

  const addCard = async (input: CreateCardInput) => {
    return await createCardMutation({
      variables: input,
    });
  };

  const editCard = async (input: UpdateCardInput) => {
    return await updateCardMutation({
      variables: input,
    });
  };

  const removeCard = async (id: string) => {
    return await deleteCardMutation({
      variables: { id },
    });
  };

  return {
    cards: data?.cards || [],
    loading,
    error,
    creating,
    updating,
    deleting,
    addCard,
    editCard,
    removeCard,
    refetch,
  };
}
