import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HistoricalEvent, CategorySettings, EventCategory } from '@/types'
import { databaseService } from '@/services/database'

export const useTimelineStore = defineStore('timeline', () => {
  // State
  const events = ref<HistoricalEvent[]>([])
  const categories = ref<CategorySettings[]>([
    { name: 'economic', color: '#2ecc71', visible: true },
    { name: 'religion', color: '#9b59b6', visible: true },
    { name: 'politics', color: '#e74c3c', visible: true },
    { name: 'industrial', color: '#3498db', visible: true },
  ])
  const zoomLevel = ref<number>(5)
  const startDate = ref<Date>(new Date('0001-01-01'))
  const endDate = ref<Date>(new Date('2024-12-31'))
  const isLoading = ref<boolean>(true)
  const error = ref<string | null>(null)

  // Computed
  const visibleEvents = computed<HistoricalEvent[]>(() => {
    return events.value.filter((event) => {
      // Filter by relevancy based on zoom level
      const isRelevant = event.relevancyLevel >= zoomLevel.value

      // Filter by visible categories
      const hasVisibleCategory = event.categories.some(
        (cat) => categories.value.find((c) => c.name === cat)?.visible,
      )

      // Filter by date range
      const isInDateRange = event.date >= startDate.value && event.date <= endDate.value

      return isRelevant && hasVisibleCategory && isInDateRange
    })
  })

  // Actions
  async function fetchEvents() {
    isLoading.value = true
    error.value = null
    try {
      const fetchedEvents = await databaseService.getEvents()
      events.value = fetchedEvents
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch events'
      console.error('Error fetching events:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function searchEvents(query: string) {
    isLoading.value = true
    error.value = null
    try {
      const searchResults = await databaseService.searchEvents(query)
      events.value = searchResults
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search events'
      console.error('Error searching events:', e)
    } finally {
      isLoading.value = false
    }
  }

  function setZoomLevel(level: number) {
    zoomLevel.value = Math.max(1, Math.min(10, level))
  }

  function setDateRange(start: Date, end: Date) {
    startDate.value = start
    endDate.value = end
  }

  function toggleCategory(category: EventCategory) {
    const cat = categories.value.find((c) => c.name === category)
    if (cat) {
      cat.visible = !cat.visible
    }
  }

  function addEvent(event: HistoricalEvent) {
    events.value.push(event)
  }

  function removeEvent(eventId: string) {
    events.value = events.value.filter((e) => e.id !== eventId)
  }

  return {
    // State
    events,
    categories,
    zoomLevel,
    startDate,
    endDate,
    isLoading,
    error,

    // Computed
    visibleEvents,

    // Actions
    fetchEvents,
    searchEvents,
    setZoomLevel,
    setDateRange,
    toggleCategory,
    addEvent,
    removeEvent,
  }
})
