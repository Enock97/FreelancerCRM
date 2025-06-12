export const STATUS_OPTIONS = {
  VENTER_PA_SVAR: 'Venter på svar',
  I_SAMTALE: 'I samtale',
  TENKER_PA_DET: 'Tenker på det',
  AVKLART: 'Avklart',
} as const

export type StatusKey = keyof typeof STATUS_OPTIONS
