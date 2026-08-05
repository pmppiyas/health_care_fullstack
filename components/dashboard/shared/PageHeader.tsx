"use client"

import { Button } from "@/components/ui/button"
import React from "react"

interface HeaderAction {
  label: string
  onClick?: () => void
  icon?: React.ReactNode
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "sm" | "default" | "lg"
}

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actions?: HeaderAction[]
  components?: React.ReactNode
}

const PageHeader = ({
  title,
  description,
  icon,
  actions = [],
  components,
}: PageHeaderProps) => {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title */}
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {icon}
          </div>
        )}

        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Components */}
        {components && (
          <div className="flex items-center gap-2">{components}</div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                size={action.size ?? "default"}
                variant={action.variant ?? "default"}
                onClick={action.onClick}
                className="gap-2"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default PageHeader
