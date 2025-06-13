import { StatusKey } from '@/constants/status'

/** Felter brukeren kan redigere / opprette på en kontakt */
export type ContactInputType = {
  name: string
  email: string
  phone?: string  
  company?: string
  note?: string
  status?: StatusKey
}
