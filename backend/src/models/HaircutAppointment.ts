export interface HaircutAppointment {
  userId: string
  haircutId: string
  createdAt: string
  name: string
  appointmentDate: string
  done: boolean
  attachmentUrl?: string
}
