import { useMutation } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "./LoginForm";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("LoginForm", () => {
  const login = vi.fn();
  const navigate = vi.fn();
  const loginMutation = { mutate: vi.fn() };
  const createUserMutation = { mutate: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      authToken: null,
      isLoggedIn: false,
      login,
      logout: vi.fn(),
    });

    vi.mocked(useNavigate).mockReturnValue(navigate);

    vi.mocked(useMutation).mockImplementation((options) => {
      if (options?.mutationFn?.name === "createUser") {
        return createUserMutation as never;
      }

      return loginMutation as never;
    });
  });

  it("renders the login form fields and submit action", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create new account" }),
    ).toBeInTheDocument();
  });

  it("updates the username and password fields as the user types", () => {
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(usernameInput, { target: { value: "test" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    expect(usernameInput).toHaveValue("test");
    expect(passwordInput).toHaveValue("password");
  });

  it("submits the login request with the typed credentials", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    expect(loginMutation.mutate).toHaveBeenCalledWith({
      username: "test",
      password: "password",
    });
  });

  it("shows the sign up fields and submits the create user mutation", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create new account" }));

    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(createUserMutation.mutate).toHaveBeenCalledWith({
      username: "test",
      password: "password",
    });
  });
});
