import { z } from 'zod'

// api.yml components/schemas/MePlanetContent、MePlanetContentInput
/** 從未設定時 content、updated_at 皆為 null；已清空時 content 為 null */
export const MePlanetContentSchema = z.object({
  content: z.string().nullable(),
  updated_at: z.string().datetime({ offset: true }).nullable(),
})
export type MePlanetContent = z.infer<typeof MePlanetContentSchema>

/** 整份覆蓋；""、null 或省略一律存為 null（清空） */
export const MePlanetContentInputSchema = z.object({
  content: z.string().nullable().optional(),
})
export type MePlanetContentInput = z.infer<typeof MePlanetContentInputSchema>
