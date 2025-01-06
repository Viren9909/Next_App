import connectDatabase from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/emailVerifier";

export const POST = async (request: Request) => {
    await connectDatabase();
    try {
        const { username, email, password } = await request.json();
        const verifiedExistingUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (verifiedExistingUsername) {
            Response.json({
                success: false,
                message: "Username already taken."
            }, {
                status: 400
            })
        }

        const verifiedExistingEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100_000 + Math.random() + 900_000).toString();

        if (verifiedExistingEmail) {
            if (verifiedExistingEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email."
                }, { status: 400 })
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                verifiedExistingEmail.password = hashPassword;
                verifiedExistingEmail.verifyCode = verifyCode;
                verifiedExistingEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await verifiedExistingEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newuser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newuser.save();
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User Registerd successfully. Please Verify your email with otp we sent on your email."
        }, { status: 201 })

    } catch (error) {
        console.error("Error Registring user: " + error);
        return Response.json(
            {
                success: false,
                message: "Error Registring user"
            },
            {
                status: 500
            }
        )
    }
}