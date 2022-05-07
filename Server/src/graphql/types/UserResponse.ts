import { objectType } from "nexus";

export const errorType = objectType({
  name: "Error",
  definition(type) {
    type.nullable.string("field");
    type.nonNull.string("message");
  },
});

export const loginResponse = objectType({
  name: "UserResponse",
  definition(type) {
    type.nullable.field("user", { type: "User" });
    type.nullable.list.field("errors", { type: "Error" });
  },
});
