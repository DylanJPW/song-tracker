import * as v from "valibot";

export const loginSchema = v.object({
  username: v.pipe(
    v.string(),
    v.nonEmpty("Please enter a username"),
    v.minLength(3, "Username must be at least 3 characters"),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter a password"),
    v.minLength(8, "Password must be at least 8 characters"),
  ),
});

export type LoginFormData = v.InferOutput<typeof loginSchema>;