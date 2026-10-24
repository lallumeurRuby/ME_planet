import { z } from 'zod'

// api.yml components/schemas/LoginRequest、LoginResponse
export const LoginRequestSchema = z.object({
  password: z.string(),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResponseSchema = z.object({
  token: z.string(),
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>
