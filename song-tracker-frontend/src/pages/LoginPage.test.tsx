import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {LoginPage} from "./LoginPage";

vi.mock("@/components/forms/AuthPanel", () => ({
  AuthPanel: () => <p>Auth panel</p>,
}));

describe("LoginPage", () => {
  it("renders the auth panel", () => {
    render(<LoginPage/>);

    expect(screen.getByText("Auth panel")).toBeInTheDocument();
  });
});
