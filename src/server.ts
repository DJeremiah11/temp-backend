import app from "app";
import * as http from "http";
import { getSchema } from "lib/graphql";
import { NexusGraphQLSchema } from "nexus/dist/core";
import { ApolloServer } from "apollo-server-express";

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import prisma from "lib/prisma";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

async function startApolloServer(schema: NexusGraphQLSchema) {
  // Required logic for integrating with Express

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: "/",
  });

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

  process.on("uncaughtException", async (err: Error) => {
      await prisma.$disconnect();
    console.error(err.message);
    process.exit(1); // Exit the process with a non-zero status code
  });

  process.on("unhandledRejection", async (err: Error) => {
      await prisma.$disconnect();
    console.error(err.message);
    console.log("Shutting down server");
    await server.stop();
    process.exit(1);
  });
}

const schema: NexusGraphQLSchema = getSchema();

startApolloServer(schema).catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
