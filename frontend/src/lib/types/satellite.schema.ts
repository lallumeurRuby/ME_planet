import { z } from 'zod'

export const NAME_MAX_LENGTH = 50

// api.yml components/schemas/Satellite、SatelliteInput
export const SatelliteSchema = z.object({
  id: z.number().int(),
  name: z.string().max(NAME_MAX_LENGTH),
  created_at: z.string().datetime({ offset: true }),
})
export type Satellite = z.infer<typeof SatelliteSchema>

export const SatelliteInputSchema = z.object({
  name: z.string().max(NAME_MAX_LENGTH),
})
export type SatelliteInput = z.infer<typeof SatelliteInputSchema>
