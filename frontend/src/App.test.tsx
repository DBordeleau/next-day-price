import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the dashboard scaffold", () => {
  render(<App />);
  expect(screen.getByText("Next-Day Price Prediction")).toBeInTheDocument();
});
