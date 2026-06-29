'use client'

import { create } from 'zustand'

export interface Toast {
  id: string
  title: string
  body?: string
  tone: 'success' | 'info' | 'error'
}

let counter = 0
function uid(): string {
  counter += 1
  return `t_${Date.now().toString(36)}_${counter}`
}

interface UIState {
  openCardId: string | null
  toasts: Toast[]
  setOpenCard: (id: string | null) => void
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

export const useUIStore = create<UIState>()((set) => ({
  openCardId: null,
  toasts: [],
  setOpenCard: (id) => set({ openCardId: id }),
  pushToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: uid() }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))
