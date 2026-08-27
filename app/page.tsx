
import { graphql } from "graphql";
import { schema, resolvers, Card } from "@/lib/graphql/schema";
import CardManagerClient from "@/components/cards/CardManagerClient";

// Server-Side Data Fetching Function with JSON serialization for RSC props
async function getCardsOnServer(): Promise<Card[]> {
  const query = `
    query GetCards {
      cards {
        id
        title
        description
        category
        createdAt
      }
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    rootValue: resolvers,
  });

  const rawCards = (result.data?.cards as Card[]) || [];
  return JSON.parse(JSON.stringify(rawCards));
}

// Next.js App Router Async Server Component Page
export default async function Home() {
  const cards = await getCardsOnServer();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 px-4 py-8 md:px-8 font-sans">
      <CardManagerClient initialCards={cards} />
    </div>
  );
}
