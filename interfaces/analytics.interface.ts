export interface DoctorAnalyticsSummary {
  totalDoctors: number
  activeDoctors: number
  unavailableDoctors: number
  totalPatients: number
}

export interface SpecializationStat {
  specialization: string
  count: number
}

export interface DoctorPatientStat {
  _id: string
  name: string
  specialization: string
  isAvailable: boolean
  patientCount: number
}

export interface MonthlyDoctorStat {
  year: number
  month: number
  count: number
}

export interface DoctorAnalyticsData {
  summary: DoctorAnalyticsSummary
  specializationStats: SpecializationStat[]
  doctorPatientStats: DoctorPatientStat[]
  monthlyDoctorStats: MonthlyDoctorStat[]
}

export interface DoctorAnalyticsResponse {
  success: boolean
  message: string
  data: DoctorAnalyticsData
}
