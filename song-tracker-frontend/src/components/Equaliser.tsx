const BARS = [
  { delayMs: 0, durationMs: 900 },
  { delayMs: 150, durationMs: 1100 },
  { delayMs: 300, durationMs: 800 },
  { delayMs: 450, durationMs: 1000 },
];

export function Equaliser() {
  return (
    <div
      aria-hidden="true"
      className="flex h-6 items-end gap-1 self-end pb-1.5"
    >
      {BARS.map(({ delayMs, durationMs }, index) => (
        <span
          className="h-6 w-1 origin-bottom rounded-full bg-amber-500 motion-safe:animate-equalize"
          key={index}
        />
      ))}
    </div>
  );
}
