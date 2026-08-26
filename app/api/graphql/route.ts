import { NextRequest, NextResponse } from "next/server";
import { graphql } from "graphql";
import { schema, getUserFromToken } from "@/lib/graphql/schema";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const currentUser = getUserFromToken(authHeader);

    const body = await req.json();
    const { query, variables, operationName } = body;

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: "GraphQL query is required in request body." }] },
        { status: 400 }
      );
    }

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      contextValue: { currentUser },
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { errors: [{ message: error?.message || "Internal GraphQL Server Error" }] },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  const variablesParam = url.searchParams.get("variables");
  const operationName = url.searchParams.get("operationName");

  const authHeader = req.headers.get("authorization");
  const currentUser = getUserFromToken(authHeader);

  if (!query) {
    return NextResponse.json({
      message: "GraphQL API Endpoint Ready. Send POST requests with { query, variables } or query params.",
      endpoint: "/api/graphql",
      methods: ["POST", "GET"],
    });
  }

  try {
    let variables;
    if (variablesParam) {
      variables = JSON.parse(variablesParam);
    }

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      contextValue: { currentUser },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ errors: [{ message: error.message }] }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
