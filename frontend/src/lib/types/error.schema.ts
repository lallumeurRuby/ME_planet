import { z } from 'zod'

// api.yml components/schemas/Error
export const ErrorCodeSchema = z.enum([
  'UNAUTHORIZED',
  'INVALID_PASSWORD',
  'LOGIN_LOCKED',
  'REQUIRED_FIELD_EMPTY',
  'FIELD_TOO_LONG',
  'NOT_FOUND',
  'NAME_DUPLICATED',
  'HAS_CHILDREN',
])
export type ErrorCode = z.infer<typeof ErrorCodeSchema>

export const ErrorSchema = z.object({
  code: ErrorCodeSchema,
  message: z.string(),
})
export type ApiErrorBody = z.infer<typeof ErrorSchema>
