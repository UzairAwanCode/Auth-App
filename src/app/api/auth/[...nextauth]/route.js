import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";
import { signIn } from "next-auth/react";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connect();
                try {
                    const user = await User.findOne({ email: credentials.email });
                    if (user) {
                        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                        if (isPasswordValid) {
                            return user;
                        }
                    }
                    throw new Error("Invalid Email or Password");
                } catch (err) {
                    throw new Error(err.message || "An error occurred");
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? ""
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider == "credentials") {
                return true;
            }
            if (account?.provider == "github") {
                await connect()
                try {
                    const existingUser = await User.findOne({ email: user.email })
                    if (!existingUser) {
                        const newUser = new User({
                            email: user.email
                        })
                        await newUser.save()
                        return true
                    }
                    return true
                }
                catch (err) {
                    throw new Error(err.message || "An error occurred")
                    return false
                }
            }
        }
    },
    pages: {
        signIn: "/login", // Custom sign-in page
        error: "/login" // Redirect to the login page on error
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};


export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }