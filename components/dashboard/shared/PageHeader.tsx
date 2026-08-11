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
    <header className="flex w-full flex-wrap items-center justify-between gap-3 py-4">
      {/* Title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h1>

          {description && (
            <p className="truncate text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Components + Actions */}
      {(components || actions.length > 0) && (
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
          {/* Components */}
          {components && (
            <div className="flex shrink-0 items-center gap-2">{components}</div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size={action.size ?? "default"}
                  variant={action.variant ?? "default"}
                  onClick={action.onClick}
                  className="shrink-0 gap-2"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default PageHeader
