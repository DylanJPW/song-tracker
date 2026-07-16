import { useState } from "react";

export function SignUpForm() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  function handleSubmit() {
    return null;
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
          placeholder="Enter unique username"
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
      <button
        className="mt-2 w-fit cursor-pointer self-end rounded-sm bg-blue-500 p-2"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
