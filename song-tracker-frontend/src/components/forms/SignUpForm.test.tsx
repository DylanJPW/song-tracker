import {useMutation} from "@tanstack/react-query";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useNavigate} from "react-router";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {useAuth} from "@/context/AuthContext";
import {SignUpForm} from "./SignUpForm";

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

describe("SignUpForm", () => {
  const login = vi.fn();
  const navigate = vi.fn();
  const mutate = vi.fn();
  let mutationOptions: any;

  const renderSignUpForm = () => {
    render(<SignUpForm setIsSignUp={vi.fn()}/>);
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

  it("renders the sign up form fields and submit action", () => {
    renderSignUpForm();

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {name: "Sign Up"}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Log in with existing account",
      }),
    ).toBeInTheDocument();
  });

  it("updates the form fields as the user types", async () => {
    const user = userEvent.setup();

    renderSignUpForm();

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput =
      screen.getByLabelText("Confirm Password");

    await user.type(usernameInput, "test");
    await user.type(passwordInput, "password");
    await user.type(confirmPasswordInput, "password");

    expect(usernameInput).toHaveValue("test");
    expect(passwordInput).toHaveValue("password");
    expect(confirmPasswordInput).toHaveValue("password");
  });

  it("enables the submit button when the form is valid", async () => {
    const user = userEvent.setup();

    renderSignUpForm();

    const submitButton = screen.getByRole("button", {
      name: "Sign Up",
    });

    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Username"), "test");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "password",
    );

    await user.tab();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("submits the create user mutation with the typed credentials", async () => {
    const user = userEvent.setup();

    renderSignUpForm();

    await user.type(screen.getByLabelText("Username"), "test");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "password",
    );

    await user.tab();

    await user.click(
      screen.getByRole("button", {
        name: "Sign Up",
      }),
    );

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        username: "test",
        password: "password",
      });
    });
  });

  it("logs the user in and navigates on successful signup", () => {
    renderSignUpForm();

    mutationOptions.onSuccess(
      {token: "jwt-token"},
      {
        username: "test",
        password: "password",
      },
    );

    expect(login).toHaveBeenCalledWith("jwt-token");
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it.skip("shows a username error when signup fails", () => {
    renderSignUpForm();

    mutationOptions.onError({
      message: "Username already exists",
    });

    expect(
      screen.getByText("Username already exists"),
    ).toBeInTheDocument();
  });

  it("switches back to the login form", async () => {
    const user = userEvent.setup();
    const setIsSignUp = vi.fn();

    render(<SignUpForm setIsSignUp={setIsSignUp}/>);

    await user.click(
      screen.getByRole("button", {
        name: "Log in with existing account",
      }),
    );

    expect(setIsSignUp).toHaveBeenCalledWith(false);
  });
});