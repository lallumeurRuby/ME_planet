import type { RequestHandler } from 'msw'
// Worker adds per-resource handler imports here:
import { authHandlers } from './auth'
import { paragraphHandlers } from './paragraphs'
import { satelliteHandlers } from './satellites'
import { subSatelliteHandlers } from './sub-satellites'

export const handlers: RequestHandler[] = [
  // Worker adds handler spreads here:
  ...authHandlers,
  ...satelliteHandlers,
  ...subSatelliteHandlers,
  ...paragraphHandlers,
]
