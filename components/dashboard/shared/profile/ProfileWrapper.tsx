"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import {
  User,
  Shield,
  Phone,
  FileText,
  Lock,
  Camera,
  Loader2,
  BookmarkCheck,
  UserCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import PageHeader from "@/components/dashboard/shared/PageHeader"

import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth.api"
import { Role } from "@/app/api/user/user.interface"
import { Skeleton } from "@/components/ui/skeleton"

const SPECIALIZATIONS = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
  "Other",
]

interface ProfileFormValues {
  name: string
  photoUrl?: string
  password?: string
  phone?: string
  designation?: string
  specialization?: string
  qualifications?: string
  hospital?: string
  department?: string
  licenseNumber?: string
  yearsOfExperience?: number
  consultationFee?: number
  isAvailable?: boolean
}

export default function ProfileWrapper() {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [serverError, setServerError] = useState("")

  const defaultValues = useMemo<ProfileFormValues>(() => {
    if (!user) {
      return {
        name: "",
        photoUrl: "",
        password: "",
      }
    }

    const base = {
      name: user.name ?? "",
      photoUrl: user.photoUrl ?? "",
      password: "",
    }

    if (user.role === Role.ADMIN) {
      return {
        ...base,
        phone: (user as any).adminId?.phone ?? "",
        designation: (user as any).adminId?.designation ?? "",
      }
    }

    if (user.role === Role.DOCTOR) {
      return {
        ...base,
        phone: (user as any).doctorId?.phone ?? "",
        specialization:
          (user as any).doctorId?.specialization ?? "General Practice",
        qualifications:
          (user as any).doctorId?.qualifications?.join(", ") ?? "",
        hospital: (user as any).doctorId?.hospital ?? "",
        department: (user as any).doctorId?.department ?? "",
        licenseNumber: (user as any).doctorId?.licenseNumber ?? "",
        yearsOfExperience: (user as any).doctorId?.yearsOfExperience ?? 0,
        consultationFee: (user as any).doctorId?.consultationFee ?? 0,
        isAvailable: (user as any).doctorId?.isAvailable ?? true,
      }
    }

    return base
  }, [user])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues,
  })

  useEffect(() => {
    if (user) {
      reset(defaultValues)
    }
  }, [user, defaultValues, reset])

  if (isUserLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Failed to load user profile.
      </div>
    )
  }

  const onSubmit = async (data: any) => {
    setServerError("")

    const payload: any = {
      name: data.name,
      photoUrl: data.photoUrl || null,
    }

    if (data.password) {
      payload.password = data.password
    }

    if (user.role === Role.ADMIN) {
      payload.phone = data.phone || null
      payload.designation = data.designation || null
    } else if (user.role === Role.DOCTOR) {
      payload.phone = data.phone || null
      payload.specialization = data.specialization
      payload.qualifications = data.qualifications
        ? data.qualifications
            .split(",")
            .map((q: string) => q.trim())
            .filter(Boolean)
        : []
      payload.hospital = data.hospital || null
      payload.department = data.department || null
      payload.licenseNumber = data.licenseNumber || null
      payload.yearsOfExperience = Number(data.yearsOfExperience) || 0
      payload.consultationFee = Number(data.consultationFee) || 0
      payload.isAvailable = data.isAvailable
    }

    try {
      await updateProfile(payload).unwrap()
      toast.success("Profile updated successfully")
      reset({ ...data, password: "" })
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to update profile"
      setServerError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your profile information and account details"
        icon={<User className="size-5" />}
      />

      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Card Header */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative">
              {defaultValues.photoUrl ? (
                <img
                  src={defaultValues.photoUrl}
                  alt={user.name}
                  className="size-24 rounded-2xl object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl bg-primary/10">
                  <UserCircle2 className="size-12 text-primary" />
                </div>
              )}
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Shield className="size-3.5" />
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* General Section */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Account Details
            </h4>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Avatar Image URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Camera className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                  <Input
                    id="photoUrl"
                    {...register("photoUrl")}
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Leave empty to keep current password"
                  className="pl-9"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Role-specific Section */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h4 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Profile Details
            </h4>

            {user.role === Role.ADMIN && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <div className="relative">
                    <FileText className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                    <Input
                      id="designation"
                      {...register("designation")}
                      placeholder="e.g. Senior Clinic Administrator"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+1 (555) 000-0000"
                      className="pl-9"
                    />
                  </div>
                </div>
              </>
            )}

            {user.role === Role.DOCTOR && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <select
                      id="specialization"
                      {...register("specialization")}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
                    >
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital</Label>
                    <Input
                      id="hospital"
                      {...register("hospital")}
                      placeholder="Hospital affiliation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      {...register("department")}
                      placeholder="Department"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      {...register("licenseNumber")}
                      placeholder="Medical license #"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      {...register("yearsOfExperience")}
                      placeholder="Experience in years"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">
                      Consultation Fee ($)
                    </Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      {...register("consultationFee")}
                      placeholder="Fee in USD"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-8">
                    <Controller
                      name="isAvailable"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="isAvailable"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="isAvailable"
                      className="cursor-pointer text-sm font-medium"
                    >
                      Available for Appointment
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications">
                    Qualifications (Comma Separated)
                  </Label>
                  <div className="relative">
                    <BookmarkCheck className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                    <Input
                      id="qualifications"
                      {...register("qualifications")}
                      placeholder="MBBS, MD, FRCP"
                      className="pl-9"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Separate multiple qualifications with a comma.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
          <Button
            type="submit"
            disabled={isUpdating}
            className="min-w-40 gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
