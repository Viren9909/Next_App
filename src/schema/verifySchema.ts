import {z} from "zod"

export const VerifySchema = z.object({
    code:z.string().length(6,{message:"verify code length should be 6 digit."})
})