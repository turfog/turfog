import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      {icon && (
        <div className="w-14 h-14 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center mx-auto mb-3">
          {icon}
        </div>
      )}
      <p className="text-body-sm font-medium text-neutral-600">{title}</p>
      {description && (
        <p className="text-caption text-neutral-400 mt-1 max-w-xs mx-auto">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}