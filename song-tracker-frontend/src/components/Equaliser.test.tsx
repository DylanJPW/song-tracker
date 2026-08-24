import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Equaliser } from "@/components/Equaliser";

describe("Equalizer", () => {
  it("is hidden from assistive technology, since it carries no information", () => {
    const { container } = render(<Equaliser />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders one bar per pulse", () => {
    const { container } = render(<Equaliser />);

    expect(container.querySelectorAll("span")).toHaveLength(4);
  });

  it("animates each bar, gated behind motion-safe", () => {
    const { container } = render(<Equaliser />);

    for (const bar of container.querySelectorAll("span")) {
      expect(bar).toHaveClass("motion-safe:animate-equalize");
    }
  });

  it("staggers the bars so they do not pulse in lockstep", () => {
    const { container } = render(<Equaliser />);
    const bars = [...container.querySelectorAll<HTMLElement>("span")];

    const delays = new Set(bars.map((bar) => bar.style.animationDelay));
    const durations = new Set(bars.map((bar) => bar.style.animationDuration));

    expect(delays.size).toBeGreaterThan(1);
    expect(durations.size).toBeGreaterThan(1);
  });
});
