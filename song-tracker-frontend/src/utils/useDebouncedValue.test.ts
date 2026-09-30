import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

const DELAY_MS = 300;

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", DELAY_MS));

    expect(result.current).toBe("initial");
  });

  it("does not update the value before the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: "initial" } },
    );

    rerender({ value: "updated" });
    act(() => vi.advanceTimersByTime(DELAY_MS - 1));

    expect(result.current).toBe("initial");
  });

  it("updates the value once the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: "initial" } },
    );

    rerender({ value: "updated" });
    act(() => vi.advanceTimersByTime(DELAY_MS));

    expect(result.current).toBe("updated");
  });

  it("only applies the latest value when changed rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => vi.advanceTimersByTime(DELAY_MS - 1));
    rerender({ value: "abc" });
    act(() => vi.advanceTimersByTime(DELAY_MS - 1));

    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(1));

    expect(result.current).toBe("abc");
  });

  it("restarts the timer when the delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebouncedValue(value, delayMs),
      { initialProps: { value: "initial", delayMs: DELAY_MS } },
    );

    rerender({ value: "updated", delayMs: DELAY_MS });
    act(() => vi.advanceTimersByTime(DELAY_MS - 1));
    rerender({ value: "updated", delayMs: DELAY_MS * 2 });
    act(() => vi.advanceTimersByTime(DELAY_MS));

    expect(result.current).toBe("initial");

    act(() => vi.advanceTimersByTime(DELAY_MS));

    expect(result.current).toBe("updated");
  });

  it("works with non-string values", () => {
    const initial = { query: "a" };
    const updated = { query: "b" };
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: initial } },
    );

    rerender({ value: updated });
    act(() => vi.advanceTimersByTime(DELAY_MS));

    expect(result.current).toBe(updated);
  });

  it("clears the pending timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = renderHook(() => useDebouncedValue("value", DELAY_MS));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
