import {useMutation} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import {useNavigate} from "react-router";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {useAuth} from "@/context/AuthContext";
import {LoginForm} from "./LoginForm";
import userEvent from "@testing-library/user-event";

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
  const mutate = vi.fn();
  let mutationOptions: any;

  const renderLoginForm = () => {
    render(<LoginForm setIsSignUp={vi.fn()}/>);
  };

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
      mutationOptions = options;

      return {
        mutate,
      } as never;
    });
  });

  it("renders the login form fields and submit action", () => {
    renderLoginForm();

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: "Log In"}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: "Create new account"}),
    ).toBeInTheDocument();
  });

  it("updates the username and password fields as the user types", async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(usernameInput, "test");
    await user.type(passwordInput, "password");

    expect(usernameInput).toHaveValue("test");
    expect(passwordInput).toHaveValue("password");
  });

  it("enables the submit button when valid", async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const submitButton = screen.getByRole("button", {
      name: "Log In",
    });

    expect(submitButton).toBeDisabled();

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(usernameInput, "test");
    await user.type(passwordInput, "password");
    await user.tab();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("submits the login mutation with the typed credentials", async () => {
    const user = userEvent;

    renderLoginForm();

    const submitButton = screen.getByRole("button", {
      name: "Log In",
    });
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(usernameInput, "test");
    await user.type(passwordInput, "password");
    await user.tab();
    await user.click(submitButton);

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        username: "test",
        password: "password",
      });
    });
  });

  it("logs the user in and navigates on successful login", () => {
    renderLoginForm();

    mutationOptions.onSuccess(
      {token: "jwt-token"},
      {
        username: "test",
        password: "password",
      }
    );

    expect(login).toHaveBeenCalledWith("jwt-token");
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("sets sign up mode when clicking create account", async () => {
    const user = userEvent;
    const setIsSignUp = vi.fn();

    render(<LoginForm setIsSignUp={setIsSignUp}/>);

    const createNewAccountButton = screen.getByRole("button", {
      name: "Create new account",
    });

    await user.click(createNewAccountButton);

    expect(setIsSignUp).toHaveBeenCalledWith(true);
  });
});