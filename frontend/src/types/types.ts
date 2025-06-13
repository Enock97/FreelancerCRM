// src/types/types.ts  (eller hvor Contact er definert)
import { StatusKey } from '@/constants/status'

export interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  note?: string
  status: StatusKey            
  createdAt: string
}

export interface User {
  id: number;
  email: string;
}

export interface Activity {
  id: number
  title: string
  note: string | null
  createdAt: string
  contactId: number
}


