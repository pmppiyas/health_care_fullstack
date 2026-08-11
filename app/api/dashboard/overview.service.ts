import Appointment from "@/app/api/appointment/appointment.model"
import Doctor from "@/app/api/doctor/doctor.model"
import Patient from "@/app/api/patient/patient.model"
import { AppointmentStatus } from "@/interfaces/appointment.interface"

const getOverview = async () => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [
    totalDoctors,
    activeDoctors,
    totalPatients,
    activePatients,
    totalAppointments,
    todayAppointments,
    scheduledAppointments,
    completedAppointments,
    appointmentsByStatus,
    appointmentsByType,
    monthlyAppointments,
    recentAppointments,
  ] = await Promise.all([
    Doctor.countDocuments(),

    Doctor.countDocuments({ isAvailable: true }),

    Patient.countDocuments(),

    Patient.countDocuments({ status: "Active" }),

    Appointment.countDocuments(),

    Appointment.countDocuments({
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
    }),

    Appointment.countDocuments({ status: AppointmentStatus.SCHEDULED }),

    Appointment.countDocuments({ status: AppointmentStatus.COMPLETED }),

    // Appointments grouped by status
    Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]),

    // Appointments grouped by type
    Appointment.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]),

    // Monthly appointments for the last 6 months
    Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setMonth(new Date().getMonth() - 5, 1)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
    ]),

    // Recent 5 appointments (populated)
    Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "doctorId", select: "name specialization" })
      .populate({ path: "patientId", select: "name condition" })
      .lean(),
  ])

  return {
    stats: {
      totalDoctors,
      activeDoctors,
      totalPatients,
      activePatients,
      totalAppointments,
      todayAppointments,
      scheduledAppointments,
      completedAppointments,
    },
    appointmentsByStatus,
    appointmentsByType,
    monthlyAppointments,
    recentAppointments,
  }
}

export const DashboardOverviewService = { getOverview }
