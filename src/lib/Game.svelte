<script lang="ts">
  import { checkGroupMatch, shuffleArray } from './gameUtils'
  import WordGrid from './WordGrid.svelte'
  import SelectedWords from './SelectedWords.svelte'
  import CategoryBar from './CategoryBar.svelte'
  import Controls from './Controls.svelte'
  import MistakeCounter from './MistakeCounter.svelte'
  import GameOverModal from './GameOverModal.svelte'
  import type { Category, GameState } from './types'

  // Post-Christmas Culture Puzzle
  const puzzle = {
    categories: [
      { name: 'New Year New Me', color: '#f4d35e', words: ['DETOX', 'LOCK IN', 'GRIND', 'GLOW UP'] },
      { name: 'Artists associated with weather', color: '#3aa655', words: ['CHRIS BREEZY', 'HURRICANE CHRIS', 'HOT GIRL', 'SUMMER WALKER'] },
      { name: 'Get my body right', color: '#4a90e2', words: ['WEIGHT', 'PRESS', 'GYM', 'CARDIO'] },
      { name: 'Corporate bullshit', color: '#b392f0', words: ['FAMILY', 'EMAIL', 'QUARTER', 'OFFSITE'] }
    ]
  }

  let allWords = shuffleArray(puzzle.categories.flatMap(cat => cat.words))

  let gameState: GameState = {
    selected: [],
    solved: [],
    attempts: 4,
    mistakes: 0,
    gameOver: false,
    won: false
  }

  let isAnimating = false
  let shakeAnimation = false
  let feedbackMessage = ''

  function saveGameState(): void {
    localStorage.setItem('gameState', JSON.stringify({
      allWords,
      gameState,
      puzzle
    }))
  }

  function loadGameState(): void {
    const saved = localStorage.getItem('gameState')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        allWords = data.allWords
        gameState = data.gameState
      } catch (e) {
        console.error('Failed to load game state:', e)
      }
    }
  }

  function handleWordClick(word: string): void {
    if (gameState.selected.includes(word)) {
      gameState.selected = gameState.selected.filter(w => w !== word)
    } else if (gameState.selected.length < 4) {
      gameState.selected = [...gameState.selected, word]
    }
  }

  function handleDeselect(word: string): void {
    gameState.selected = gameState.selected.filter(w => w !== word)
  }

  function handleShuffle(): void {
    if (isAnimating) return
    isAnimating = true
    
    // Fade out effect
    const gridElement = document.querySelector('.word-grid')
    if (gridElement) {
      gridElement.classList.add('animate-shuffle-fade-out')
    }

    setTimeout(() => {
      allWords = shuffleArray(allWords)
      
      if (gridElement) {
        gridElement.classList.remove('animate-shuffle-fade-out')
        gridElement.classList.add('animate-shuffle-fade-in')
      }

      setTimeout(() => {
        if (gridElement) {
          gridElement.classList.remove('animate-shuffle-fade-in')
        }
        isAnimating = false
      }, 100)
    }, 100)
  }

  function showFeedbackMessage(message: string): void {
    feedbackMessage = message
    setTimeout(() => {
      feedbackMessage = ''
    }, 1500)
  }

  function handleSubmit(): void {
    if (gameState.selected.length !== 4 || isAnimating) return

    isAnimating = true
    const match = checkGroupMatch(gameState.selected, puzzle.categories)

    if (match) {
      const solvedCategory = puzzle.categories.find(cat =>
        cat.words.every(w => gameState.selected.includes(w))
      )!

      gameState.solved = [...gameState.solved, solvedCategory]
      allWords = allWords.filter(w => !solvedCategory.words.includes(w))
      gameState.selected = []

      if (gameState.solved.length === 4) {
        gameState.won = true
        gameState.gameOver = true
        saveGameState()
      }

      setTimeout(() => {
        isAnimating = false
      }, 400)
    } else {
      // Shake animation for wrong guess
      const gridElement = document.querySelector('.word-grid')
      if (gridElement) {
        gridElement.classList.add('shake')
      }

      gameState.mistakes++
      gameState.attempts--

      // Determine feedback message
      if (gameState.attempts === 1) {
        showFeedbackMessage('One away...')
      } else if (gameState.attempts <= 0) {
        showFeedbackMessage('Better luck next time')
      } else {
        showFeedbackMessage('Not quite')
      }

      setTimeout(() => {
        if (gridElement) {
          gridElement.classList.remove('shake')
        }
        gameState.selected = []

        if (gameState.attempts <= 0) {
          gameState.gameOver = true
        }

        isAnimating = false
      }, 400)
    }
  }

  function handleDismissModal(): void {
    gameState.gameOver = false
  }

  function handleReset(): void {
    allWords = shuffleArray(puzzle.categories.flatMap(cat => cat.words))
    gameState = {
      selected: [],
      solved: [],
      attempts: 4,
      mistakes: 0,
      gameOver: false,
      won: false
    }
    isAnimating = false
    feedbackMessage = ''
    localStorage.removeItem('gameState')
  }

  $: unsolvedCategories = puzzle.categories.filter(
    cat => !gameState.solved.some(solved => solved.name === cat.name)
  )
</script>

<div class="game-container">
  <header>
    <h1>Connections</h1>
    <p class="subtitle">Find groups of four related items</p>
  </header>

  <main>
    <div class="game-board">
      {#each gameState.solved as category}
        <CategoryBar {category} solved={true} />
      {/each}

      {#if !gameState.gameOver}
        <WordGrid
          words={allWords.filter(w => !gameState.solved.flatMap(s => s.words).includes(w))}
          selected={gameState.selected}
          onWordClick={handleWordClick}
          {isAnimating}
          shakeAnimation={shakeAnimation && isAnimating}
        />

        <SelectedWords
          words={gameState.selected}
          onDeselect={handleDeselect}
        />

        <Controls
          selected={gameState.selected}
          onShuffle={handleShuffle}
          onDeselectAll={() => gameState.selected = []}
          onSubmit={handleSubmit}
          submitDisabled={gameState.selected.length !== 4}
          {isAnimating}
        />

        <MistakeCounter
          remaining={gameState.attempts}
          mistakes={gameState.mistakes}
        />

        {#if feedbackMessage}
          <div class="feedback-message animate-message">
            {feedbackMessage}
          </div>
        {/if}
      {:else}
        <GameOverModal
          gameOver={gameState.gameOver}
          won={gameState.won}
          solvedCategories={gameState.solved}
          unsolvedCategories={unsolvedCategories}
          onDismiss={handleDismissModal}
          onPlayAgain={handleReset}
        />
      {/if}
    </div>
  </main>
</div>

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-light-bg);
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 24px;
  }

  header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
    letter-spacing: 1px;
  }

  .subtitle {
    margin: 8px 0 0 0;
    color: var(--color-text-secondary);
    font-size: 14px;
  }

  main {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .game-board {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    width: 100%;
  }

  .feedback-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-dark);
    color: var(--color-white);
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    z-index: 999;
    pointer-events: none;
    animation: messageFadeIn 300ms ease-out forwards, messageFadeOut 300ms ease-out 1200ms forwards;
  }

  @keyframes messageFadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes messageFadeOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
  }

  @keyframes gridShake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
  }

  @keyframes shuffleFadeOut {
    to {
      opacity: 0;
    }
  }

  @keyframes shuffleFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .game-container {
      padding: 20px;
    }

    header {
      margin-bottom: 32px;
    }

    header h1 {
      font-size: 32px;
    }

    .subtitle {
      font-size: 16px;
    }

    .game-board {
      gap: 16px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .game-container {
      padding: 24px;
    }

    header {
      margin-bottom: 40px;
    }

    header h1 {
      font-size: 36px;
    }

    .game-board {
      gap: 18px;
    }
  }
</style>
