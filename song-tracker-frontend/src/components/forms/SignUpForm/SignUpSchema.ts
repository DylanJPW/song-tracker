import * as v from "valibot";

export const signUpSchema = v.pipe(
  v.object({
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
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please confirm your password"),
      v.minLength(8, "Password must be at least 8 characters"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
);

export type SignUpFormData = v.InferOutput<typeof signUpSchema>;