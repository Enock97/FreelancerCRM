export interface Activity {
  id: number;
  description: string;
  createdAt: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  note?: string;
  createdAt: string;
  activities?: Activity[];
}
