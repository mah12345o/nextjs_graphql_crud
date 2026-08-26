import type { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "@/components/ApolloWrapper";

export const metadata: Metadata = {
  title: "GraphQL Mastery - Full-Stack Interactive Next.js Application",
  description:
    "An interactive GraphQL learning and development environment featuring Apollo Client caching policies, JWT authentication headers, offset & cursor pagination, and live query execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#080c14] text-slate-100 selection:bg-pink-500/30 selection:text-pink-200">
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
