import { create } from 'zustand'

export interface GroupProgress {
  groupId: string
  currentAmount: number
  targetAmount: number
  membersCount: number
  totalMembers: number
  status: string
}

interface RealtimeStore {
  groupProgress: Record<string, GroupProgress>
  setGroupProgress: (data: GroupProgress) => void
  clearGroup: (groupId: string) => void
}

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  groupProgress: {},
  setGroupProgress: (data) =>
    set((s) => ({ groupProgress: { ...s.groupProgress, [data.groupId]: data } })),
  clearGroup: (groupId) =>
    set((s) => {
      const next = { ...s.groupProgress }
      delete next[groupId]
      return { groupProgress: next }
    }),
}))
