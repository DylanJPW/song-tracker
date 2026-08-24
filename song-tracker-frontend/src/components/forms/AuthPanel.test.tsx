import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";
import type {LoginSignUpProps} from "@/components/types";
import {AuthPanel} from "./AuthPanel";

vi.mock("@/components/forms/LoginForm/LoginForm", () => ({
  LoginForm: ({setIsSignUp}: LoginSignUpProps) => (
    <div>
      <p>Login form</p>
      <button onClick={() => setIsSignUp(true)} type="button">
        Create new account
      </button>
    </div>
  ),
}));

vi.mock("@/components/forms/SignUpForm/SignUpForm", () => ({
  SignUpForm: ({setIsSignUp}: LoginSignUpProps) => (
    <div>
      <p>Sign up form</p>
      <button onClick={() => setIsSignUp(false)} type="button">
        Log in with existing account
      </button>
    </div>
  ),
}));

describe("AuthPanel", () => {
  it("shows the login form by default", () => {
    render(<AuthPanel/>);

    expect(screen.getByText("Login form")).toBeInTheDocument();
    expect(screen.queryByText("Sign up form")).not.toBeInTheDocument();
  });

  it("switches to the sign up form", async () => {
    const user = userEvent.setup();

    render(<AuthPanel/>);

    await user.click(
      screen.getByRole("button", {name: "Create new account"}),
    );

    expect(screen.getByText("Sign up form")).toBeInTheDocument();
    expect(screen.queryByText("Login form")).not.toBeInTheDocument();
  });

  it("switches back to the login form", async () => {
    const user = userEvent.setup();

    render(<AuthPanel/>);

    await user.click(
      screen.getByRole("button", {name: "Create new account"}),
    );
    await user.click(
      screen.getByRole("button", {name: "Log in with existing account"}),
    );

    expect(screen.getByText("Login form")).toBeInTheDocument();
    expect(screen.queryByText("Sign up form")).not.toBeInTheDocument();
  });
});
