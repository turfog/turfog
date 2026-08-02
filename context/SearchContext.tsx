"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface SearchState {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SearchContext = createContext<SearchState | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <SearchContext.Provider value={{ open, setOpen }}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchState {
  return useContext(SearchContext) ?? { open: false, setOpen: () => {} };
}