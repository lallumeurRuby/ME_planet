import { z } from 'zod'

export const TITLE_MAX_LENGTH = 100

// api.yml components/schemas/Paragraph、ParagraphCreateInput、ParagraphUpdateInput
export const ParagraphSchema = z.object({
  id: z.number().int(),
  sub_satellite_id: z.number().int(),
  title: z.string().max(TITLE_MAX_LENGTH),
  summary: z.string().nullable(),
  content: z.string(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
})
export type Paragraph = z.infer<typeof ParagraphSchema>

export const ParagraphCreateInputSchema = z.object({
  title: z.string().max(TITLE_MAX_LENGTH),
  summary: z.string().nullable().optional(),
  content: z.string(),
})
export type ParagraphCreateInput = z.infer<typeof ParagraphCreateInputSchema>

/** 整筆覆蓋：三個欄位皆須送出，summary 送 null 即清空 */
export const ParagraphUpdateInputSchema = z.object({
  title: z.string().max(TITLE_MAX_LENGTH),
  summary: z.string().nullable(),
  content: z.string(),
})
export type ParagraphUpdateInput = z.infer<typeof ParagraphUpdateInputSchema>
