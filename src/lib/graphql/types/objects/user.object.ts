import { objectType } from "nexus";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("email");
    t.string("username");
    t.string("password"); // Typically, you wouldn't expose the password field
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
  },
});
