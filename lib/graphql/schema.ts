import { makeExecutableSchema } from "@graphql-tools/schema";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

// Initial Mock Database
let usersStore: User[] = [
  {
    id: "1",
    name: "Mahesh Sharma",
    email: "mahesh@gmail.com",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@tech.io",
    role: "DEVELOPER",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-02-01T14:30:00Z",
  },
  {
    id: "3",
    name: "Alex Rivera",
    email: "alex.rivera@design.co",
    role: "DESIGNER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-02-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Elena Rostova",
    email: "elena@ai-labs.org",
    role: "RESEARCHER",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-02-18T16:45:00Z",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@cloud.net",
    role: "DEVELOPER",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    createdAt: "2026-02-22T11:20:00Z",
  },
];

let postsStore: Post[] = [
  {
    id: "101",
    title: "Understanding GraphQL Fetch Policies in Apollo Client",
    content: "Apollo Client's fetch policy controls how queries interact with the local InMemoryCache vs making network requests...",
    authorId: "1",
    createdAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "102",
    title: "Cursor vs Offset Pagination in Modern APIs",
    content: "Cursor-based pagination provides stability when dataset rows are inserted or deleted while reading pages...",
    authorId: "1",
    createdAt: "2026-02-21T15:30:00Z",
  },
  {
    id: "103",
    title: "Building Real-time GraphQL Subscriptions",
    content: "GraphQL Subscriptions allow WebSocket connections for pushing instant events from server to clients...",
    authorId: "2",
    createdAt: "2026-02-23T08:10:00Z",
  },
  {
    id: "104",
    title: "Securing GraphQL APIs with JWT Bearer Tokens",
    content: "Attach authorization tokens via Apollo HttpLink context to secure resolvers based on client roles...",
    authorId: "3",
    createdAt: "2026-02-24T18:00:00Z",
  },
];

export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    avatar: String
    createdAt: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    createdAt: String!
    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type UserPage {
    nodes: [User!]!
    totalCount: Int!
    hasMore: Boolean!
    offset: Int!
    limit: Int!
  }

  type Query {
    users(search: String, role: String): [User!]!
    user(id: ID!): User
    me: User
    posts: [Post!]!
    post(id: ID!): Post
    usersOffset(limit: Int = 3, offset: Int = 0): UserPage!
    usersCursor(first: Int = 3, after: String): UserConnection!
    schemaSDL: String!
  }

  type Mutation {
    createUser(name: String!, email: String!, role: String): User!
    updateUser(id: ID!, name: String, email: String, role: String): User!
    deleteUser(id: ID!): Boolean!
    createPost(title: String!, content: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
    login(email: String!): AuthPayload!
  }
`;

export const resolvers = {
  Query: {
    users: (_: any, { search, role }: { search?: string; role?: string }) => {
      let filtered = [...usersStore];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
      }
      if (role && role !== "ALL") {
        filtered = filtered.filter((u) => u.role === role);
      }
      return filtered;
    },

    user: (_: any, { id }: { id: string }) => {
      return usersStore.find((u) => u.id === id) || null;
    },

    me: (_: any, __: any, context: { currentUser?: User }) => {
      if (!context.currentUser) {
        throw new Error("UNAUTHENTICATED: Invalid or missing Authorization token header.");
      }
      return context.currentUser;
    },

    posts: () => postsStore,

    post: (_: any, { id }: { id: string }) => {
      return postsStore.find((p) => p.id === id) || null;
    },

    usersOffset: (_: any, { limit = 3, offset = 0 }: { limit: number; offset: number }) => {
      const safeLimit = Math.max(1, limit);
      const safeOffset = Math.max(0, offset);
      const nodes = usersStore.slice(safeOffset, safeOffset + safeLimit);
      const totalCount = usersStore.length;
      const hasMore = safeOffset + safeLimit < totalCount;
      return {
        nodes,
        totalCount,
        hasMore,
        offset: safeOffset,
        limit: safeLimit,
      };
    },

    usersCursor: (_: any, { first = 3, after }: { first: number; after?: string }) => {
      const safeFirst = Math.max(1, first);
      let startIndex = 0;
      if (after) {
        const decodedIndex = parseInt(Buffer.from(after, "base64").toString("utf-8"), 10);
        if (!isNaN(decodedIndex)) {
          startIndex = decodedIndex + 1;
        }
      }

      const slicedUsers = usersStore.slice(startIndex, startIndex + safeFirst);
      const edges = slicedUsers.map((user, idx) => {
        const globalIndex = startIndex + idx;
        const cursor = Buffer.from(globalIndex.toString()).toString("base64");
        return {
          cursor,
          node: user,
        };
      });

      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
      const hasNextPage = startIndex + safeFirst < usersStore.length;
      const hasPreviousPage = startIndex > 0;

      return {
        edges,
        pageInfo: {
          endCursor,
          hasNextPage,
          hasPreviousPage,
        },
        totalCount: usersStore.length,
      };
    },

    schemaSDL: () => typeDefs,
  },

  Mutation: {
    createUser: (_: any, { name, email, role }: { name: string; email: string; role?: string }) => {
      const newUser: User = {
        id: String(Date.now()),
        name,
        email,
        role: role || "DEVELOPER",
        avatar: `https://images.unsplash.com/photo-${1534528741775 + (usersStore.length % 5)}?auto=format&fit=crop&w=250&q=80`,
        createdAt: new Date().toISOString(),
      };
      usersStore.unshift(newUser);
      return newUser;
    },

    updateUser: (
      _: any,
      { id, name, email, role }: { id: string; name?: string; email?: string; role?: string }
    ) => {
      const index = usersStore.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error(`User with ID ${id} not found.`);
      }
      const existing = usersStore[index];
      const updated: User = {
        ...existing,
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      };
      usersStore[index] = updated;
      return updated;
    },

    deleteUser: (_: any, { id }: { id: string }) => {
      const initialLen = usersStore.length;
      usersStore = usersStore.filter((u) => u.id !== id);
      postsStore = postsStore.filter((p) => p.authorId !== id);
      return usersStore.length < initialLen;
    },

    createPost: (
      _: any,
      { title, content, authorId }: { title: string; content: string; authorId: string }
    ) => {
      const author = usersStore.find((u) => u.id === authorId);
      if (!author) {
        throw new Error(`Author with ID ${authorId} does not exist.`);
      }
      const newPost: Post = {
        id: String(100 + postsStore.length + 1),
        title,
        content,
        authorId,
        createdAt: new Date().toISOString(),
      };
      postsStore.unshift(newPost);
      return newPost;
    },

    updatePost: (
      _: any,
      { id, title, content }: { id: string; title?: string; content?: string }
    ) => {
      const index = postsStore.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(`Post with ID ${id} not found.`);
      }
      const existing = postsStore[index];
      const updated: Post = {
        ...existing,
        ...(title && { title }),
        ...(content && { content }),
      };
      postsStore[index] = updated;
      return updated;
    },

    deletePost: (_: any, { id }: { id: string }) => {
      const initialLen = postsStore.length;
      postsStore = postsStore.filter((p) => p.id !== id);
      return postsStore.length < initialLen;
    },

    login: (_: any, { email }: { email: string }) => {
      const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error(`Invalid credentials. User with email "${email}" not found.`);
      }
      // Create a lightweight simulated JWT token: base64(userId:email:role)
      const tokenPayload = `${user.id}:${user.email}:${user.role}:${Date.now()}`;
      const token = `jwt_mock_${Buffer.from(tokenPayload).toString("base64")}`;
      return {
        token,
        user,
      };
    },
  },

  User: {
    posts: (parent: User) => postsStore.filter((post) => post.authorId === parent.id),
  },

  Post: {
    author: (parent: Post) => usersStore.find((user) => user.id === parent.authorId) || null,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export function getUserFromToken(token?: string | null): User | undefined {
  if (!token) return undefined;
  const cleanToken = token.replace(/^Bearer\s+/i, "");
  if (!cleanToken.startsWith("jwt_mock_")) return undefined;

  try {
    const raw = Buffer.from(cleanToken.replace("jwt_mock_", ""), "base64").toString("utf-8");
    const [id] = raw.split(":");
    return usersStore.find((u) => u.id === id);
  } catch {
    return undefined;
  }
}
