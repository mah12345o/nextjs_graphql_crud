import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export interface NetworkLogItem {
  id: string;
  timestamp: string;
  operationName: string;
  operationType: string;
  query: string;
  variables?: any;
  fetchPolicy?: string;
  durationMs: number;
  status: "SUCCESS" | "ERROR";
  response?: any;
  fromCache?: boolean;
}

type LogListener = (log: NetworkLogItem) => void;
const listeners: Set<LogListener> = new Set();

export function subscribeNetworkLogs(listener: LogListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyNetworkLog(log: NetworkLogItem) {
  listeners.forEach((fn) => fn(log));
}

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

const authLink = setContext((operation, { headers }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("graphql_auth_token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const loggingLink = new ApolloLink((operation, forward) => {
  const startTime = performance.now();
  const opName = operation.operationName || "AnonymousQuery";
  const queryStr = operation.query ? operation.query.loc?.source.body || "" : "";
  const opType = queryStr.trim().startsWith("mutation") ? "Mutation" : "Query";

  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (response: any) => {
        const durationMs = Math.round(performance.now() - startTime);
        const log: NetworkLogItem = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          operationName: opName,
          operationType: opType,
          query: queryStr,
          variables: operation.variables,
          durationMs,
          status: response.errors ? "ERROR" : "SUCCESS",
          response: response.data || response.errors,
          fromCache: durationMs < 5,
        };
        notifyNetworkLog(log);
        observer.next(response);
      },
      error: (err: any) => observer.error(err),
      complete: () => observer.complete(),
    });
    return () => sub.unsubscribe();
  });
});

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        usersOffset: {
          keyArgs: false,
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              nodes: [...existing.nodes, ...incoming.nodes],
            };
          },
        },
        usersCursor: {
          keyArgs: false,
          merge(existing, incoming) {
            if (!existing) return incoming;
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
              pageInfo: incoming.pageInfo,
            };
          },
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, loggingLink, httpLink]),
  cache: apolloCache,
});

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("graphql_auth_token");
}

export function setStoredToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("graphql_auth_token", token);
  }
}

export function clearStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("graphql_auth_token");
  }
}
