import { useState } from "react";
import { createUser, type User } from "@/api/authentication";
import { useQuery } from "@tanstack/react-query";

export function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [account, setAccount] = useState<User>({ username, password });

  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useQuery({
    queryKey: ["account", account],
    queryFn: () => createUser(account),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setAccount({ username, password });
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <div className="my-2 flex flex-col">
        <label className="pl-2" htmlFor="username">
          Username
        </label>
        <input
          aria-label="username"
          className="rounded-2xl border-2 border-white p-2"
          defaultValue={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          type="text"
        />
      </div>
      <div className="my-2 flex flex-col">
        <label className="pl-2" htmlFor="password">
          Password
        </label>
        <input
          aria-label="password"
          className="rounded-2xl border-2 border-white p-2"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          type="password"
        />
      </div>
      {isSignUp ? (
        <div className="my-2 flex flex-col">
          <label className="pl-2" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            aria-label="confirm-password"
            className="rounded-2xl border-2 border-white p-2"
            placeholder="Confirm password"
            type="password"
          />
        </div>
      ) : null}
      <button
        className="my-2 w-fit cursor-pointer self-end rounded-sm bg-blue-500 p-2"
        type="submit"
      >
        {isSignUp ? "Sign Up" : "Log In"}
      </button>
      <div className="text-center">
        <button
          className="cursor-pointer underline"
          onClick={() => setIsSignUp(!isSignUp)}
          type="button"
        >
          {isSignUp ? "Login with existing account" : "Create new account"}
        </button>
      </div>
    </form>
  );
}
