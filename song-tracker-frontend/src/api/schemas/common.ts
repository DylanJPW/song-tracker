import * as v from 'valibot'

export const apiDate = v.pipe(
  v.union([v.string(), v.date()]),
  v.transform(input => (typeof input === 'string' ? new Date(input) : input))
)