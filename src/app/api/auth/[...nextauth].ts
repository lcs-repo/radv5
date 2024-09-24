// Configure NextAuth

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/app/utils/dbConnect';
import User, { IUser } from '@/app/models/User';
import { DefaultUser } from "next-auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'RT' | 'Radiologist';
}

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('No user found with the given email');
        }

        const isValid = await (user as IUser).comparePassword(credentials!.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: (user as IUser & { _id: string })._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'RT' | 'Radiologist';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/login',
  },
});