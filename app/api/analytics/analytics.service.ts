import Doctor from "@/app/api/doctor/doctor.model"
import Patient from "@/app/api/patient/patient.model"

const getDoctorAnalytics = async () => {
  const [
    totalDoctors,
    activeDoctors,
    unavailableDoctors,
    totalPatients,
    specializationStats,
    doctorPatientStats,
    monthlyDoctorStats,
  ] = await Promise.all([
    Doctor.countDocuments(),

    Doctor.countDocuments({
      isAvailable: true,
    }),

    Doctor.countDocuments({
      isAvailable: false,
    }),

    Patient.countDocuments(),

    Doctor.aggregate([
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          specialization: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    // Patients per doctor
    Doctor.aggregate([
      {
        $lookup: {
          from: "patients",
          localField: "patientIds",
          foreignField: "_id",
          as: "patients",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          specialization: 1,
          isAvailable: 1,
          patientCount: {
            $size: "$patients",
          },
        },
      },
      {
        $sort: {
          patientCount: -1,
        },
      },
    ]),

    // Doctors created month-wise
    Doctor.aggregate([
      {
        $match: {
          createdAt: {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: {
            $sum: 1,
          },
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
  ])

  return {
    summary: {
      totalDoctors,
      activeDoctors,
      unavailableDoctors,
      totalPatients,
    },

    specializationStats,

    doctorPatientStats,

    monthlyDoctorStats,
  }
}

export const AnalyticsServices = {
  getDoctorAnalytics,
}
