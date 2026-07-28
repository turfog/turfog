"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircleIcon } from "@/components/SvgIcons";
import Button from "@/components/ui/Button";

// ----- Types -----

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ----- Component -----

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-md text-center"
      >
        <div className="w-20 h-20 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircleIcon size={40} className="text-coral" />
        </div>

        <h1 className="text-display-xs text-neutral-900 mb-3">
          Something went wrong
        </h1>

        <p className="text-body-md text-neutral-500 mb-2">
          We encountered an error while loading your dashboard.
        </p>

        {error.digest && (
          <p className="text-body-xs text-neutral-400 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} theme="green" size="lg">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            theme="neutral"
            size="lg"
          >
            Go home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}