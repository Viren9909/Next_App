import CredentialsProvider from "next-auth/providers/credentials";
import connectDatabase from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"

export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credintials",
            name: "Credintials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "text" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await connectDatabase()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user Found with this Credentials.")
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified please verify first.")
                    } else {
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                        if (isPasswordCorrect) {
                            return user
                        } else {
                            throw new Error("Invailid password.")
                        }
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.username = user.username
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.username = token.username
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET
}