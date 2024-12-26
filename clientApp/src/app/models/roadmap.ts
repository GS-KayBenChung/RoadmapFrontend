export interface Roadmap {
  roadmapId: string
  title: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  overallProgress: number
  overallDuration: number
  isCompleted: boolean
  isDeleted: boolean
  isDraft: boolean
  createdByUser: any
  milestones: any[]
}