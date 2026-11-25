import * as v from "valibot";

export const apiDate = v.pipe(
  v.union([v.string(), v.date()]),
  v.transform((input) => (typeof input === "string" ? new Date(input) : input)),
);

const yearMonth = v.pipe(
  v.string(),
  v.regex(/^\d{4}-\d{2}$/),
  v.transform((value) => {
    const [year, month] = value.split("-");

    if (year && month) {
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        1,
      ).toLocaleDateString("en-GB", { month: "long" });
    }
    throw new Error("Invalid date format");
  }),
);

export const MonthlyPractice = v.object({
  yearMonth: yearMonth,
  count: v.number(),
});
export type MonthlyPractice = v.InferOutput<typeof MonthlyPractice>;