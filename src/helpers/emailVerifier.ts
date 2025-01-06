import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails//VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "My App | Verification code",
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return { success: true, message: "Successfully send Email Verification" }
    } catch (emailError) {
        console.error("Error while sending Email verification: " + emailError)
        return { success: false, message: "Failed to send Email Verification" }
    }
}