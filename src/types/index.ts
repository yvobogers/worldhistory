export type EventCategory = 'economic' | 'religion' | 'politics' | 'industrial'

export interface HistoricalEvent {
  id: string
  title: string
  description: string
  date: Date
  categories: EventCategory[]
  relevancyLevel: number // 1-10, higher means more significant
  imageUrl?: string
  icon?: string // Material Symbols icon name
}

export interface CategorySettings {
  name: EventCategory
  color: string
  visible: boolean
}

export interface TimelineState {
  events: HistoricalEvent[]
  categories: CategorySettings[]
  zoomLevel: number // 1-10, higher means more zoomed out
  startDate: Date
  endDate: Date
}
