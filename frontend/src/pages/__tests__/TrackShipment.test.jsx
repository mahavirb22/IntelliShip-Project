import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import TrackShipment from "../TrackShipment";

vi.mock("../../services/api", () => ({
  createComplaint: vi.fn(),
  getShipment: vi.fn(),
  trackShipmentSecure: vi.fn(),
}));

describe("TrackShipment page", () => {
  it("renders tracking form", () => {
    render(
      <MemoryRouter initialEntries={["/track"]}>
        <Routes>
          <Route path="/track" element={<TrackShipment />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/intelliship tracking/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/shipment id/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /track shipment/i }),
    ).toBeInTheDocument();
  });
});
