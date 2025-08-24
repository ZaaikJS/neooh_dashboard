import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name ?? '',
                    email: profile.email,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/',
        signOut: '/',
        error: '/', // você pode customizar uma página de erro se quiser
    },
    callbacks: {
        async signIn({ user }) {
            const ok = user?.email?.toLowerCase().endsWith('@neooh.com.br');
            if (!ok) {
                return '/?error=OrganizationOnly';
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
};