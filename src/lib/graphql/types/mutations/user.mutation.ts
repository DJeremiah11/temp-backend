import { comparePassword, generateToken, generateUserIdFromToken, hashPassword } from "lib/auth";
import { Context } from "lib/graphql/context";

import { mutationField, nonNull, stringArg } from "nexus";

export const createUserMutation = mutationField('createUser', {
    type: 'User', // Adjust this to match your User type definition in Nexus
    args: {
      name: stringArg(),
      email: stringArg(),
      password: stringArg(),
      username: stringArg(),
    },
    resolve: async (_, args, _ctx: Context) => {
        const { prisma } = _ctx
        const { name, email, password, username } = args
      // Validate input (this is a simple example, you might want more validation)
      if (!name || !email || !password || !username) {
        throw new Error('All fields are required');
      }

  
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
  
      // Hash the password
    //   const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          email,
          password,
          username,
        },
      });
  
      return newUser;
    },
  });

  export const updateUserMutation = mutationField('updateUser', {
    type: 'User',
    args: {
      id: nonNull(stringArg()),
      name: stringArg(),
      email: stringArg(),
      password: stringArg(),
    },
    resolve: async (_, { id, name, email, password }, ctx: Context) => {
      const data: any = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (password) data.password = await hashPassword(password); // hypothetical hashPassword function
  
      const user = await ctx.prisma.user.update({
        where: { id },
        data,
      });
  
      return user;
    },
  });

  export const deleteUserMutation = mutationField('deleteUser', {
    type: 'User',
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_, { id }, ctx: Context) => {
      const user = await ctx.prisma.user.delete({
        where: { id },
      });
  
      return user;
    },
  });

  export const loginUserMutation = mutationField('login', {
    type: 'User',
    args: {
      email: nonNull(stringArg()),
      password: nonNull(stringArg()),
    },
    resolve: async (_, { email, password }, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });
  
      if (!user || !comparePassword(password, user.password)) { // hypothetical comparePassword function
        throw new Error('Invalid credentials');
      }
  
      const token = generateToken(user.id); // hypothetical generateToken function
      ctx.res.cookie('token', token, { httpOnly: true });
  
      return user;
    },
  });

  export const logoutUserMutation = mutationField('logout', {
    type: 'String',
    resolve: async (_, __, ctx: Context) => {
      ctx.res.clearCookie('token');
      return 'Logged out';
    },
  });

  export const changePasswordMutation = mutationField('changePassword', {
    type: 'User',
    args: {
      currentPassword: nonNull(stringArg()),
      newPassword: nonNull(stringArg()),
    },
    resolve: async (_, { currentPassword, newPassword }, ctx: Context) => {
      const userId = generateUserIdFromToken(ctx.req); // hypothetical function to get user ID from token
  
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user || !comparePassword(currentPassword, user.password)) { // hypothetical comparePassword function
        throw new Error('Invalid current password');
      }
  
      const hashedNewPassword = await hashPassword(newPassword); // hypothetical hashPassword function
      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
        },
      });
  
      return updatedUser;
    },
  });
  

//   export const logUserActivityMutation = mutationField('logUserActivity', {
//     type: 'String',
//     resolve: async (_, __, ctx: Context) => {
//       const ip = ctx.req.ip;
//       const userAgent = ctx.req.headers['user-agent'] || '';
  
//       await ctx.prisma.log.create({
//         data: {
//           ip,
//           userAgent,
//           timestamp: new Date(),
//         },
//       });
  
//       return 'Activity logged';
//     },
//   });
  

  
  