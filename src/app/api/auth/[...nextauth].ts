import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/app/utils/dbConnect';
import User, { IUser } from '@/app/models/User';
import { JWT } from 'next-auth/jwt';
import type { DefaultUser } from 'next-auth';

interface CustomUser {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: 'RT' | 'Radiologist';
}

interface User {
  _id: { toString: () => string };
  name: string;
  email: string;
}

declare module 'next-auth' {
  interface User extends DefaultUser {
    role?: 'RT' | 'Radiologist';
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: 'RT' | 'Radiologist';
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        console.log('Attempting to authorize with email:', credentials.email);

        const user = await User.findOne({ email: credentials.email }) as IUser | null;
        if (!user) {
          console.log('No user found with email:', credentials.email);
          throw new Error('No user found with the given email');
        }

        console.log('User found:', user);

        const isValid = await user.comparePassword(credentials.password);
        console.log('Password comparison result:', isValid);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
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
  pages: {
    signIn: '/login',
    error: '/api/auth/error', // Add this line
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this in your environment variables
};

export default NextAuth(authOptions);