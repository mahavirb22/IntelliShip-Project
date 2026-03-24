import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Login from "../Login";

vi.mock("../../services/api", () => ({
  signin: vi.fn(),
}));

describe("Login page", () => {
  it("renders sign in form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/seller@company\.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022/i,
      ),
    ).toBeInTheDocument();
  });
});
