import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { createUser, loginRequest } from "@/api/authentication";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: createUser,
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.token);
      navigate("/");
      toast(`Successfully logged in as ${username}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSignUp) {
      createUserMutation.mutate({
        username,
        password,
      });
    } else {
      loginMutation.mutate({
        username,
        password,
      });
    }
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <div className="my-2 flex flex-col">
        <label className="pl-2" htmlFor="username">
          Username
        </label>
        <input
          className="rounded-2xl border-2 border-white p-2"
          defaultValue={username}
          id="username"
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
          className="rounded-2xl border-2 border-white p-2"
          defaultValue={password}
          id="password"
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
            className="rounded-2xl border-2 border-white p-2"
            id="confirm-password"
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
