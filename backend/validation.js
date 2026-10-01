import * as z from "zod";

const createBlogSchema = z.object({
    title: z.string().trim().min(1),
    content: z.string().trim().min(1),
    anonymous: z.boolean().default(false)
});

export { createBlogSchema } ;

const updateBlogSchema = createBlogSchema.partial();

export { updateBlogSchema } ;

const registerSchema = z.object({
    username: z.string().trim().min(8).max(20),
    name: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(1,{
        message:"username or email and password is required"
    })
});

export { registerSchema } ;

const loginSchema = z.object({
    identifier: z.string().trim().min(1),
    password:z.string().min(1,{
        message:"username or email and password is required"
    })
});

export { loginSchema } ;