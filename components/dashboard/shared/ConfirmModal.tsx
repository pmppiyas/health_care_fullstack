import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2, X } from "lucide-react"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean

  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info"
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconClass: "text-destructive bg-destructive/10",
    confirmClass:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500 bg-amber-500/10",
    confirmClass: "bg-amber-500 text-white hover:bg-amber-600",
  },
  info: {
    icon: AlertTriangle,
    iconClass: "text-primary bg-primary/10",
    confirmClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const config = variantConfig[variant]
  const Icon = config.icon

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose()
    }
    if (open) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, isLoading, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isLoading) onClose()
      }}
    >
      {/* Blurred dark overlay */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md animate-in rounded-2xl border border-border bg-card shadow-xl duration-200 fade-in-0 zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-5 p-6">
          {/* Icon */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${config.iconClass}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${config.confirmClass}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                confirmLabel
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
