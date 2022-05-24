// /graphql/schema.ts
import { fieldAuthorizePlugin, makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";
import { validatePlugin } from "nexus-validate";

export const schema = makeSchema({
  types,
  plugins: [validatePlugin(), fieldAuthorizePlugin()],
  outputs: {
    typegen: join(process.cwd(), "node_modules", "@types", "nexus-typegen", "index.d.ts"),
    schema: join(process.cwd(), "src", "graphql", "schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "./src/context.ts"),
  },
});
