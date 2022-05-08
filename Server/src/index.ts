import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { Context } from "./context";
import { schema } from "./schema";

const prisma = new PrismaClient({
  log: ["query"],
});

async function main() {
  // express and Apollo Setup
  const app = express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  // Redis setup
  let RedisStore = connectRedis(session);
  let redis = new Redis();
  // redis.connect().catch(console.error)

  // setup session and auth cookie
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 8,
        httpOnly: true,
        secure: false, // only work in https
        sameSite: "lax",
      },
      secret: "supersecret",
      resave: true,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    debug: true,
    schema: schema,
    context: ({ req, res }): Context => ({ prisma, req, res, redis }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  // starting server and hooking into express middleware
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
  app.get("/", (_req, res) => res.redirect("/graphql"));
  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000`);
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//
