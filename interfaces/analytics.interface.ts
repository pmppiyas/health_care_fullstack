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

// Patients-------------
export interface PatientAnalyticsSummary {
  totalPatients: number
  activePatients: number
  followUpPatients: number
  newPatients: number
}

export interface PatientConditionStat {
  condition: string
  count: number
}

export interface PatientDoctorStat {
  _id: string
  name: string
  specialization: string
  patientCount: number
}

export interface MonthlyPatientStat {
  year: number
  month: number
  count: number
}

export interface PatientAnalyticsData {
  summary: PatientAnalyticsSummary
  conditionStats: PatientConditionStat[]
  doctorPatientStats: PatientDoctorStat[]
  monthlyPatientStats: MonthlyPatientStat[]
}

export interface PatientAnalyticsResponse {
  success: boolean
  message: string
  data: PatientAnalyticsData
}
