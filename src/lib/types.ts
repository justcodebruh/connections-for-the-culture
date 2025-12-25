export interface Category {
  name: string
  color: string
  words: string[]
}

export interface Puzzle {
  categories: Category[]
}

export interface GameState {
  selected: string[]
  solved: Category[]
  attempts: number
  mistakes: number
  gameOver: boolean
  won: boolean
}
