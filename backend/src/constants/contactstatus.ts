export const CONTACT_STATUSES = [
  'VENTER_PA_SVAR',
  'I_SAMTALE',
  'TENKER_PA_DET',
  'AVKLART',
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];
