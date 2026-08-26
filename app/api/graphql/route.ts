import { NextRequest, NextResponse } from "next/server";
import { graphql } from "graphql";
import { schema, resolvers } from "@/lib/graphql/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, variables } = body;

    if (!query) {
      return NextResponse.json({ errors: [{ message: "No query provided" }] }, { status: 400 });
    }

    const result = await graphql({
      schema,
      source: query,
      rootValue: resolvers,
      variableValues: variables,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ errors: [{ message: error.message || "Internal server error" }] }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "GraphQL API Route Active. Send POST requests to /api/graphql" });
}
