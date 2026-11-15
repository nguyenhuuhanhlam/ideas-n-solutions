import { z } from 'zod';

/** Tất cả tọa độ/kích thước là số nguyên, đơn vị mm. */
const mm = z.number().int();

export const pointSchema = z.object({
  x: mm,
  y: mm,
});

export const wallSchema = z.object({
  id: z.string(),
  start: pointSchema,
  end: pointSchema,
  thickness: mm,
  height: mm.optional(),
});

export const openingSchema = z.object({
  id: z.string(),
  wallId: z.string(),
  type: z.enum(['door', 'window']),
  offset: mm,
  width: mm,
  height: mm,
  sillHeight: mm,
});

export const levelSchema = z.object({
  id: z.string(),
  name: z.string(),
  elevation: mm,
  height: mm,
  walls: z.array(wallSchema),
  openings: z.array(openingSchema),
});

export const buildingSchema = z.object({
  version: z.literal(1),
  levels: z.array(levelSchema),
});

export type Point = z.infer<typeof pointSchema>;
export type Wall = z.infer<typeof wallSchema>;
export type Opening = z.infer<typeof openingSchema>;
export type Level = z.infer<typeof levelSchema>;
export type Building = z.infer<typeof buildingSchema>;
