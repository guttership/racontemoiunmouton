import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Configure providers
const providers: Provider[] = [];

// Google OAuth (si configuré)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      checks: ["state"], // Désactive PKCE, garde seulement state
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  );
}

// Provider Email/Password (Credentials)
providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email et mot de passe requis");
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user || !user.hashedPassword) {
        return null;
      }

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.hashedPassword
      );

      if (!isValid) {
        return null;
      }

      // Vérifier que l'email est vérifié
      if (!user.emailVerified) {
        throw new Error("EMAIL_NOT_VERIFIED");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth providers (Google) vérifient l'email automatiquement
      if (account && account.provider !== "credentials") {
        return true;
      }

      // Pour credentials, vérifier que l'email est vérifié
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { emailVerified: true },
        });

        if (!dbUser?.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Permet les URLs relatives
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permet les URLs sur le même domaine
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;

        // Récupérer le statut premium depuis la DB
        if (session.user.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { isPremium: true },
          });
          session.user.isPremium = user?.isPremium ?? false;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
