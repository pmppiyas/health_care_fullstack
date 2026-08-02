import { withAuth } from "@/middleware/withAuth"
import { Role } from "@/app/api/user/user.interface"
import { PatientService } from "@/app/api/patient/patient.services"
import { sendResponse } from "@/lib/utils/sendResponse"
import { StatusCodes } from "http-status-codes"

