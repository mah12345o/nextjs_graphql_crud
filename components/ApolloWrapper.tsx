"use client";

import React, { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apollo-client";

interface ApolloWrapperProps {
  children: ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
