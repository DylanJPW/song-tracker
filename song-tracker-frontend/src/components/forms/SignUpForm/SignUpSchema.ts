import {z} from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(1, "Please enter a username").min(3, "Username must be at least 3 characters"),
    password: z.string().min(1, "Please enter a password").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password").min(8, "Password must be at least 8 characters")
  })
  .superRefine((data, ctx) => {
    if (
      data.confirmPassword !== undefined &&
      data.password !== data.confirmPassword
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;