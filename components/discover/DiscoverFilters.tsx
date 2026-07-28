"use client";

import React from "react";

const filters = ["Today", "This week", "Near me", "All levels", "Free only"];

export default function DiscoverFilters() {
  const [activeFilters, setActiveFilters] = React.useState<Set<string>>(
    new Set(["Near me"])
  );

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => toggleFilter(filter)}
          className={`px-3 py-1.5 rounded-full text-body-xs font-medium transition-all duration-200 border ${
            activeFilters.has(filter)
              ? "bg-primary-green text-white border-primary-green"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}