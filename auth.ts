import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error('Invalid credentials format');
        }

        await connectToDatabase();

        const user = await User.findOne({ email: parsedCredentials.data.email }).select('+password');

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.password) {
          throw new Error('Please login with your social account');
        }

        const isPasswordMatch = await bcrypt.compare(
          parsedCredentials.data.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      
      // Handle user update
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
});
