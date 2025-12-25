import type { Category } from './types'

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function checkGroupMatch(selectedWords: string[], categories: Category[]): boolean {
  return categories.some(category =>
    category.words.length === 4 &&
    selectedWords.every(word => category.words.includes(word))
  )
}
