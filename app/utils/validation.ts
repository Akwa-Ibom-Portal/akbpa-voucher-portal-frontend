import { z } from 'zod'

/** Accepts 080XXXXXXXX, 234XXXXXXXXXX or +234XXXXXXXXXX — the formats Nigerian
 *  beneficiaries/staff actually type, without being strict about spacing/dashes. */
const NIGERIAN_PHONE_REGEX = /^(\+?234|0)[789]\d{9}$/

export const phoneSchema = z
  .string()
  .trim()
  .regex(NIGERIAN_PHONE_REGEX, 'Enter a valid Nigerian phone number, e.g. 080XXXXXXXX')

export const optionalPhoneSchema = z
  .union([phoneSchema, z.literal('')])
  .optional()
  .transform(v => v || undefined)

export const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email address')

export const optionalEmailSchema = z
  .union([z.string().trim().email('Enter a valid email address'), z.literal('')])
  .optional()
  .transform(v => v || undefined)
