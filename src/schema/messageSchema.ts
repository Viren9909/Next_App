import { z } from "zod"

export const MessageSchema = z.object({
    content: z.string()
        .max(300, { message: "Message charecter must not exceed 200 character." })
        .min(1, { message: "Message should contain at least 2 or more character." })

})