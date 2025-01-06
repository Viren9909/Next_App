import { z } from "zod"

export const UserNameValidation = z
    .string()
    .min(3, "User Name Should contain at least 3 or more character.")
    .max(15, "User Name Should not longer than 15 character.")
    .regex(/^[a-zA-Z0-9_]+$/, "User Name Does not contain Special Symbols.")

export const SignUpSchema = z.object({
    username: UserNameValidation,
    email: z.string().email({ message: "Email is Not valid." }),
    password: z.string().min(6, { message: "Password length should be 6 at least." })
})