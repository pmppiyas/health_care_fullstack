import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import Doctor from "@/app/api/doctor/doctor.model"
import Appointment from "@/app/api/appointment/appointment.model"
import DoctorPatient from "@/app/api/doctor-patient/doctorPatient.model"
import { AppointmentStatus } from "@/interfaces/appointment.interface"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { AppError } from "@/lib/error/AppError"
import { NextRequest } from "next/server"
import { Types } from "mongoose"

export const GET = withAuth(Role.DOCTOR)(async (
  req: NextRequest,
  context,
  user
) => {
  const doctor = await Doctor.findOne({ userId: user.id }).select("_id")
  if (!doctor) {
    throw new AppError(404, "Doctor profile not found for this user")
  }

  const doctorId = doctor._id

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [
    totalPatients,
    totalAppointments,
    todayAppointments,
    scheduledAppointments,
    completedAppointments,
    appointmentsByStatus,
    appointmentsByType,
    monthlyAppointments,
    recentAppointments,
  ] = await Promise.all([
    // 1. Total Patients assigned to this doctor
    DoctorPatient.countDocuments({ doctorId }),

    // 2. Total Appointments
    Appointment.countDocuments({ doctorId }),

    // 3. Today's Appointments
    Appointment.countDocuments({
      doctorId,
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
    }),

    // 4. Scheduled Appointments
    Appointment.countDocuments({ doctorId, status: AppointmentStatus.SCHEDULED }),

    // 5. Completed Appointments
    Appointment.countDocuments({ doctorId, status: AppointmentStatus.COMPLETED }),

    // 6. Appointments grouped by status
    Appointment.aggregate([
      { $match: { doctorId: new Types.ObjectId(doctorId.toString()) } },
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

    // 7. Appointments grouped by type
    Appointment.aggregate([
      { $match: { doctorId: new Types.ObjectId(doctorId.toString()) } },
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

    // 8. Monthly appointments for the last 6 months
    Appointment.aggregate([
      {
        $match: {
          doctorId: new Types.ObjectId(doctorId.toString()),
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5, 1)),
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

    // 9. Recent 5 appointments
    Appointment.find({ doctorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "doctorId", select: "name specialization" })
      .populate({ path: "patientId", select: "name condition" })
      .lean(),
  ])

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor dashboard overview data retrieved successfully",
    data: {
      stats: {
        totalPatients,
        totalAppointments,
        todayAppointments,
        scheduledAppointments,
        completedAppointments,
      },
      appointmentsByStatus,
      appointmentsByType,
      monthlyAppointments,
      recentAppointments,
    },
  })
})
