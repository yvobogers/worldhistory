import type { HistoricalEvent } from '@/types'

// Mock database of historical events
const mockEvents: HistoricalEvent[] = [
  {
    id: '1',
    title: 'Industrial Revolution Begins',
    description:
      'The Industrial Revolution marks a major turning point in human history, fundamentally changing economic and social organization.',
    date: new Date('1760-01-01'),
    categories: ['industrial', 'economic'],
    relevancyLevel: 10,
    icon: 'precision_manufacturing',
  },
  {
    id: '2',
    title: 'French Revolution',
    description:
      'The French Revolution was a period of radical political and societal change in France.',
    date: new Date('1789-07-14'),
    categories: ['politics'],
    relevancyLevel: 9,
    icon: 'gavel',
  },
  {
    id: '3',
    title: 'Protestant Reformation',
    description:
      'The Protestant Reformation was a major religious reform movement that began in the 16th century.',
    date: new Date('1517-10-31'),
    categories: ['religion', 'politics'],
    relevancyLevel: 8,
    icon: 'menu_book',
  },
  {
    id: '4',
    title: 'Great Depression',
    description:
      'The Great Depression was a severe worldwide economic depression that began in 1929.',
    date: new Date('1929-10-29'),
    categories: ['economic', 'politics'],
    relevancyLevel: 9,
    icon: 'trending_down',
  },
  {
    id: '5',
    title: 'First Assembly Line',
    description:
      'Henry Ford introduces the first moving assembly line, revolutionizing industrial production.',
    date: new Date('1913-12-01'),
    categories: ['industrial', 'economic'],
    relevancyLevel: 7,
    icon: 'conveyor_belt',
  },
  // Adding 10 new events
  {
    id: '6',
    title: 'Steam Engine Patent',
    description: 'James Watt patents the steam engine, powering the Industrial Revolution.',
    date: new Date('1769-01-05'),
    categories: ['industrial'],
    relevancyLevel: 8,
    icon: 'engineering',
  },
  {
    id: '7',
    title: 'First Stock Market',
    description: 'The Amsterdam Stock Exchange becomes the first modern stock market.',
    date: new Date('1602-09-01'),
    categories: ['economic'],
    relevancyLevel: 7,
    icon: 'monitoring',
  },
  {
    id: '8',
    title: 'Vatican City Established',
    description: 'The Lateran Treaty establishes Vatican City as a sovereign state.',
    date: new Date('1929-02-11'),
    categories: ['religion', 'politics'],
    relevancyLevel: 6,
    icon: 'church',
  },
  {
    id: '9',
    title: 'First Electric Power Grid',
    description: 'Thomas Edison launches the first commercial electric power grid in Manhattan.',
    date: new Date('1882-09-04'),
    categories: ['industrial', 'economic'],
    relevancyLevel: 8,
    icon: 'electric_bolt',
  },
  {
    id: '10',
    title: 'Bretton Woods Conference',
    description: 'International monetary system established, creating the World Bank and IMF.',
    date: new Date('1944-07-01'),
    categories: ['economic', 'politics'],
    relevancyLevel: 7,
    icon: 'account_balance',
  },
  {
    id: '11',
    title: 'First Ecumenical Council',
    description: 'The Council of Nicaea establishes core Christian doctrines.',
    date: new Date('325-05-20'),
    categories: ['religion'],
    relevancyLevel: 8,
    icon: 'groups',
  },
  {
    id: '12',
    title: 'First Factory Act',
    description: 'Britain passes the Factory Act of 1833, regulating child labor.',
    date: new Date('1833-08-29'),
    categories: ['industrial', 'politics'],
    relevancyLevel: 6,
    icon: 'policy',
  },
  {
    id: '13',
    title: 'Islamic Golden Age Begins',
    description: 'The House of Wisdom in Baghdad becomes a major intellectual center.',
    date: new Date('800-01-01'),
    categories: ['religion', 'economic'],
    relevancyLevel: 9,
    icon: 'auto_stories',
  },
  {
    id: '14',
    title: 'First Modern Assembly Line',
    description: 'Ransom Olds creates the first automotive assembly line.',
    date: new Date('1901-01-01'),
    categories: ['industrial'],
    relevancyLevel: 6,
    icon: 'directions_car',
  },
  {
    id: '15',
    title: 'Creation of Federal Reserve',
    description: 'The United States establishes its central banking system.',
    date: new Date('1913-12-23'),
    categories: ['economic', 'politics'],
    relevancyLevel: 8,
    icon: 'savings',
  },
]

// Simulated database service
export const databaseService = {
  async getEvents(): Promise<HistoricalEvent[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockEvents
  },

  async searchEvents(query: string): Promise<HistoricalEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()),
    )
  },

  async getEventsByDateRange(start: Date, end: Date): Promise<HistoricalEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockEvents.filter((event) => event.date >= start && event.date <= end)
  },
}
