import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../../helpers/authBcrypt";
import { connectToDB } from "@/helpers/mongodb";
import User from "@/models/userModel";

const options: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error('Credentials not provided');
                }

                await connectToDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found...");
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Password wrong...");
                }
                return {
                    id: user._id, 
                    email: user.email,
                    username: user.username,
                } as any;
            }
        })
    ]
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
