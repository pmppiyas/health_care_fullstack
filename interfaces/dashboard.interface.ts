export interface DashboardStats {
  totalDoctors: number
  activeDoctors: number
  totalPatients: number
  activePatients: number
  totalAppointments: number
  todayAppointments: number
  scheduledAppointments: number
  completedAppointments: number
}

export interface AppointmentStatusStat {
  status: string
  count: number
}

export interface AppointmentTypeStat {
  type: string
  count: number
}

export interface MonthlyAppointmentStat {
  year: number
  month: number
  count: number
}

export interface RecentAppointment {
  _id: string
  doctorId: { _id: string; name: string; specialization?: string } | string
  patientId: { _id: string; name: string; condition?: string } | string
  appointmentDate: string
  appointmentTime: string
  type: string
  status: string
}

export interface DashboardOverviewData {
  stats: DashboardStats
  appointmentsByStatus: AppointmentStatusStat[]
  appointmentsByType: AppointmentTypeStat[]
  monthlyAppointments: MonthlyAppointmentStat[]
  recentAppointments: RecentAppointment[]
}

export interface DashboardOverviewResponse {
  success: boolean
  message: string
  data: DashboardOverviewData
}
