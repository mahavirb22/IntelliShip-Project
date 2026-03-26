import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TrackShipment from "../TrackShipment";

vi.mock("../../services/api", () => ({
  createComplaint: vi.fn(),
  getEvents: vi.fn(),
  getShipment: vi.fn(),
  trackShipmentSecure: vi.fn(),
}));

describe("TrackShipment page", () => {
  it("renders tracking form", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/track"]}>
          <Routes>
            <Route path="/track" element={<TrackShipment />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/intelliship tracking/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/shipment id/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /track shipment/i }),
    ).toBeInTheDocument();
  });
});
