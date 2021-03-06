"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient({
    log: ["query"],
});
prisma.$on("query", (e) => {
    console.log("Params: " + e.params);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
        let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
        let redis = new ioredis_1.default();
        app.use((0, express_session_1.default)({
            name: "qid",
            store: new RedisStore({ client: redis, disableTouch: true }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            },
            secret: "supersecret",
            resave: false,
            saveUninitialized: false,
        }));
        const apolloServer = new apollo_server_express_1.ApolloServer({
            debug: true,
            schema: schema_1.schema,
            context: ({ req, res }) => ({ prisma, req, res, redis }),
            plugins: [apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground],
        });
        yield apolloServer.start();
        apolloServer.applyMiddleware({ app, cors: false });
        app.listen(4000, () => {
            console.log(`???? Server ready at http://localhost:4000`);
        });
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=index.js.map