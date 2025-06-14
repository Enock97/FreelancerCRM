export interface Activity {
  id: string;
  description: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  note?: string;
  createdAt: string;
  activities?: Activity[];
}
