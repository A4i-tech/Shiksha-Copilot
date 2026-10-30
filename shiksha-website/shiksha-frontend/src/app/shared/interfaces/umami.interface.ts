import { z } from 'zod';

const emptyString = z.string().default('');
const nullToUndefined = (v: unknown) => v ?? undefined;

export const UmamiUserSchema = z.object({
  _id: z.string(),
  preferredLanguage: emptyString,
  school: z.preprocess(
    nullToUndefined,
    z.object({ state: emptyString, zone: emptyString, district: emptyString, block: emptyString }).default({})
  ),
  profiles: z
    .object({
      teacher: z
        .object({
          classes: z
            .array(
              z.object({
                board: emptyString,
                medium: emptyString,
                class: z.union([z.string(), z.number()]).transform(String).default(''),
                subject: emptyString,
              })
            )
            .default([]),
        })
        .default({}),
      admin: z.object({ state: emptyString }).default({}),
    })
    .default({}),
});

export type UmamiUser = z.infer<typeof UmamiUserSchema>;

export type UmamiEventData = Record<string, string | number | boolean>;

export interface UmamiConfig {
  umamiUrl: string;
  umamiWebsiteId: string;
}
