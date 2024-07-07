import { verifyToken } from "lib/auth";
import { Context } from "lib/graphql/context";
import { list, nonNull, queryField, stringArg } from "nexus";

export const userQueryField = queryField("user", {
  type: "User",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx: Context) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: args.id },
    });
    return user;
  },
});

export const usersQueryField = queryField("users", {
  type: list("User"),
  args: {
    name: stringArg(), // this is optional, it is used to filter
    createdAt: "DateTime", // this is optional, it is used to filter
  },
  resolve: async (_, args, ctx: Context) => {
    const where = {
      ...(args.name && { name: { contains: args.name } }),
      ...(args.createdAt && { createdAt: args.createdAt }),
    };
    const users = await ctx.prisma.user.findMany({
      where,
    });
    return users;
  },
});

export const userProfileQuery = queryField("userProfile", {
  type: "User",
  resolve: async (_, __, ctx: Context) => {
    const token = ctx.req.headers.authorization || "";
    const userId = verifyToken(token);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  },
});

export const userByEmailQueryField = queryField("userByEmail", {
  type: "User",
  args: {
    email: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx: Context) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: args.email },
    });
    return user;
  },
});

//   export const usersByRoleQueryField = queryField('usersByRole', {
//     type: list('User'),
//     args: {
//       role: nonNull(stringArg()),
//     },
//     resolve: async (_, args, ctx: Context) => {
//       const users = await ctx.prisma.user.findMany({
//         where: { role: args.role },
//       });
//       return users;
//     },
//   });


// export const localizedGreeting = queryField('localizedGreeting', {
//     type: 'String',
//     resolve: async (_, __, ctx: Context) => {
//       const language = ctx.req.headers['accept-language'] || 'en';
      
//       const greeting = getGreetingInLanguage(language); // hypothetical function
  
//       return greeting;
//     },
//   });
  