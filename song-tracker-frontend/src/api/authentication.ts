import * as v from "valibot";

const User = v.object({
  username: v.string(),
  password: v.string(),
});
export type User = v.InferOutput<typeof User>;

const LoginResponse = v.object({
  token: v.string(),
});
export type LoginResponse = v.InferOutput<typeof LoginResponse>;

function getCommonRequestOptions(user: User) {
  return {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user),
  };
}

export async function createUser(user: User) {
  const response = await fetch("/api/users", getCommonRequestOptions(user));
  if (response.status === 409) {
    throw new Error(`Username '${user.username}' already in use`)
  }
  if (!response.ok) {
    throw new Error("Failed to create account");
  }
  return v.parse(LoginResponse, await response.json());
}

export async function loginRequest(user: User) {
  const response = await fetch(
    "/api/users/login",
    getCommonRequestOptions(user),
  );
  if (response.status === 401) {
    throw new Error('Username or password is incorrect')
  }
  if (!response.ok) {
    throw new Error("Failed to log in");
  }
  return v.parse(LoginResponse, await response.json());
}