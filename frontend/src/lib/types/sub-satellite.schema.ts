import { z } from 'zod'

import { NAME_MAX_LENGTH } from './satellite.schema'

// api.yml components/schemas/SubSatellite、SubSatelliteInput
export const SubSatelliteSchema = z.object({
  id: z.number().int(),
  satellite_id: z.number().int(),
  name: z.string().max(NAME_MAX_LENGTH),
  created_at: z.string().datetime({ offset: true }),
})
export type SubSatellite = z.infer<typeof SubSatelliteSchema>

export const SubSatelliteInputSchema = z.object({
  name: z.string().max(NAME_MAX_LENGTH),
})
export type SubSatelliteInput = z.infer<typeof SubSatelliteInputSchema>
