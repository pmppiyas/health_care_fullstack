import mongoose, { Schema, Model } from "mongoose"
import { IAdmin, AdminPermission } from "./admin.interface"

const adminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required to link Admin to a User account"],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?[0-9\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },

    photoUrl: {
      type: String,
      trim: true,
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      maxlength: [100, "Designation must not exceed 100 characters"],
    },

    permissions: {
      type: [String],
      enum: {
        values: Object.values(AdminPermission),
        message: `Each permission must be one of: ${Object.values(AdminPermission).join(", ")}`,
      },
      default: [AdminPermission.VIEW_REPORTS],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Admin must have at least one permission",
      },
    },

    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

adminSchema.index({ isSuperAdmin: 1 })

adminSchema.pre("save", function (next) {
  if (this.isSuperAdmin) {
    this.permissions = Object.values(AdminPermission)
  }
})

const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>("Admin", adminSchema)

export default Admin
