import * as v from "valibot";

const User = v.object({
  username: v.string(),
  password: v.string(),
});
export type User = v.InferOutput<typeof User>;

export async function createUser(user: User) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };
  const response = await fetch("/api/users", requestOptions);
  if (!response.ok) {
    throw new Error("Failed to create account");
  }
  return v.parse(User, response.json());
}
