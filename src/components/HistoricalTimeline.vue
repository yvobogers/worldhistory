<!-- HistoricalTimeline.vue -->
<template>
  <div class="timeline-wrapper">
    <div class="controls-bar">
      <div class="filters">
        <div v-for="category in categories" :key="category.name" class="category-filter">
          <input
            type="checkbox"
            :id="category.name"
            :checked="selectedCategories.includes(category.name)"
            @change="toggleCategory(category.name)"
          />
          <label :for="category.name" :style="{ color: category.color }">
            {{ category.name }}
          </label>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="loading">
      <span class="material-symbols-outlined">hourglass_top</span>
      Loading historical events...
    </div>
    <div v-else-if="error" class="error">
      <span class="material-symbols-outlined">error</span>
      {{ error }}
    </div>
    <div v-else ref="timelineContainer" class="timeline-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useTimelineStore } from '../stores/timeline'
import type { HistoricalEvent, EventCategory } from '../types'

interface TimelineStatic {
  Timeline: {
    new (container: HTMLElement, data: TimelineData, options?: TimelineOptions): TimelineInstance
  }
}

interface TimelineInstance {
  setData(data: TimelineData): void
}

interface TimelineOptions {
  start_at_end?: boolean
  default_bg_color?: string
  scale_factor?: number
  height?: number
  timenav_height?: number
  optimal_tick_width?: number
}

interface TimelineData {
  events: Array<{
    start_date: {
      year: number
      month: number
      day: number
    }
    text: {
      headline: string
      text: string
    }
    unique_id: string | number
    categories: string[]
  }>
}

declare global {
  interface Window {
    TL: TimelineStatic
  }
}

// Initialize store
const store = useTimelineStore()
const timelineContainer = ref<HTMLElement | null>(null)
const timelineInstance = ref<TimelineInstance | null>(null)
const isInitialized = ref(false)

// Reactive state
const isLoading = computed(() => store.isLoading)
const error = computed(() => store.error)
const categories = computed(() => store.categories)
const selectedCategories = computed(() => {
  return categories.value.filter((cat) => cat.visible).map((cat) => cat.name)
})
const visibleEvents = computed(() => store.visibleEvents)

// Watch for store loading state
watch(isLoading, (loading) => {
  console.log('Loading state changed:', loading)
  if (!loading && visibleEvents.value.length > 0 && timelineContainer.value) {
    console.log('Loading complete, initializing timeline')
    initTimeline()
  }
})

// Convert events to TimelineJS format
function formatEventsForTimeline(events: HistoricalEvent[]) {
  const formattedData = {
    title: {
      text: {
        headline: 'World History Timeline',
        text: 'A timeline of significant historical events',
      },
    },
    scale: 'human',
    events: events.map((event) => {
      const date = new Date(event.date)
      return {
        start_date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
        text: {
          headline: event.title,
          text: `<div class="event-content" data-categories="${event.categories.join(',')}">
            <span class="material-icons">${event.icon}</span>
            <p>${event.description}</p>
            <div class="category-indicators">
              ${event.categories
                .map((cat) => {
                  const category = categories.value.find((c) => c.name === cat)
                  return category
                    ? `<span class="category-dot" style="background-color: ${category.color}" data-category="${cat}"></span>`
                    : ''
                })
                .join('')}
            </div>
          </div>`,
        },
        unique_id: event.id,
        group: event.categories[0],
        categories: event.categories,
      }
    }),
  }
  return formattedData
}

// Toggle category visibility
function toggleCategory(category: EventCategory) {
  store.toggleCategory(category)

  // Get all visible categories
  const visibleCategories = categories.value.filter((c) => c.visible).map((c) => c.name)

  // Find all markers
  const allMarkers = document.querySelectorAll('.tl-timemarker') as NodeListOf<HTMLElement>

  allMarkers.forEach((marker) => {
    const markerCategories = (marker.dataset.categories?.split(',') ?? []) as EventCategory[]

    // A marker should be visible if ANY of its categories is visible
    const shouldBeVisible = markerCategories.some((cat) => visibleCategories.includes(cat))

    if (!shouldBeVisible) {
      marker.classList.add('tl-timemarker-hidden')
    } else {
      marker.classList.remove('tl-timemarker-hidden')
    }
  })

  // Update event content in the main view using the same logic
  const eventDivs = document.querySelectorAll(
    '.tl-slide-content .event-content',
  ) as NodeListOf<HTMLElement>

  eventDivs.forEach((div) => {
    const eventCategories = (div.dataset.categories?.split(',') ?? []) as EventCategory[]
    const shouldBeVisible = eventCategories.some((cat) => visibleCategories.includes(cat))

    div.style.visibility = shouldBeVisible ? 'visible' : 'hidden'
    div.style.opacity = shouldBeVisible ? '1' : '0'

    // Update individual category dots
    eventCategories.forEach((cat) => {
      const categoryDot = div.querySelector(`[data-category="${cat}"]`) as HTMLElement
      if (categoryDot) {
        const isCategoryVisible = visibleCategories.includes(cat)
        categoryDot.style.visibility = isCategoryVisible ? 'visible' : 'hidden'
        categoryDot.style.opacity = isCategoryVisible ? '1' : '0'
      }
    })
  })
}

// Initialize timeline
async function initTimeline() {
  if (!timelineContainer.value || visibleEvents.value.length === 0) {
    console.warn('Cannot initialize timeline: missing container or events')
    return
  }

  if (isInitialized.value) {
    return
  }

  const timelineData = formatEventsForTimeline(visibleEvents.value)
  const options = {
    start_at_end: false,
    default_bg_color: '#ffffff',
    scale_factor: 0.5,
    height: 600,
    timenav_height: 200,
    optimal_tick_width: 100,
    zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
    initial_zoom: 2,
  }

  try {
    timelineInstance.value = new window.TL.Timeline(timelineContainer.value, timelineData, options)
    isInitialized.value = true

    // After timeline is created, store category data on markers
    await nextTick()
    const markers = document.querySelectorAll('.tl-timemarker') as NodeListOf<HTMLElement>

    // Create a map of event titles to their categories for easier lookup
    const eventMap = new Map(
      timelineData.events.map((event) => [event.text.headline, event.categories]),
    )

    // Iterate through markers and assign categories based on their title
    markers.forEach((marker) => {
      const title = marker.querySelector('.tl-headline')?.textContent?.trim()
      if (title && eventMap.has(title)) {
        const categories = eventMap.get(title)
        marker.dataset.categories = categories?.join(',')
      }
    })
  } catch (error) {
    console.error('Error creating timeline:', error)
  }
}

// Initialize when mounted
onMounted(async () => {
  try {
    await store.fetchEvents()
    await nextTick()
    await initTimeline()

    // Add a class to the timeline container for our custom styles
    if (timelineContainer.value) {
      timelineContainer.value.classList.add('timeline-custom')
    }
  } catch (err) {
    console.error('Error initializing timeline:', err)
  }
})

// Add styles
const style = document.createElement('style')
style.textContent = `
  .tl-timemarker {
    transition: transform 0.3s ease, opacity 0.3s ease !important;
  }

  .tl-timemarker-hidden {
    transform: scale(0.5);
    opacity: 0.2 !important;
    pointer-events: none;
  }

  .tl-timemarker-hidden .tl-timemarker-content-container {
    opacity: 0.2 !important;
  }

  .tl-timemarker-hidden .tl-timemarker-timespan {
    opacity: 0.2 !important;
  }

  .event-content[data-categories] {
    transition: visibility 0.3s ease, opacity 0.3s ease;
  }

  .category-dot {
    transition: visibility 0.3s ease, opacity 0.3s ease;
  }
`
document.head.appendChild(style)
</script>

<style>
.timeline-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.controls-bar {
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
  width: 100%;
}

.filters {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-container {
  flex: 1;
  position: relative;
  width: 100%;
  min-height: 0;
  background: white;
}

/* TimelineJS overrides */
:deep(.tl-timeline) {
  width: 100% !important;
  max-width: none !important;
}

:deep(.tl-timenav) {
  width: 100% !important;
}

:deep(.tl-storyslider) {
  width: 100% !important;
}

:deep(.tl-timenav-container) {
  width: 100% !important;
}

:deep(.tl-slider-container-mask) {
  width: 100% !important;
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 2rem;
  color: #666;
  width: 100%;
  height: 100%;
}

.error {
  color: #e74c3c;
}

.category-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.event-content {
  padding: 12px;
}

.category-indicators {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

/* TimelineJS customizations */
:deep(.tl-timeline) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

:deep(.tl-headline-date) {
  color: #4a5568 !important;
  font-weight: 500 !important;
}

:deep(.tl-headline) {
  font-size: 1.2rem !important;
  color: #2c3e50 !important;
}

:deep(.tl-text p) {
  color: #4a5568 !important;
}

.material-icons {
  vertical-align: middle;
  margin-right: 8px;
}
</style>
