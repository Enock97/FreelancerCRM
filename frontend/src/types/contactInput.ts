// src/types/contactInput.ts
import { StatusKey } from '@/constants/status'

export type ContactInputType = {
  name: string
  email: string
  phone?: string          // <- undefined i skjemaet betyr “tomt felt”
  company?: string
  note?: string
  status?: StatusKey      // 🔸 samme union
}
