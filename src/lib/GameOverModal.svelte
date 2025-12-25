<script lang="ts">
  import type { Category } from './types'

  export let gameOver: boolean = false
  export let won: boolean = false
  export let solvedCategories: Category[] = []
  export let unsolvedCategories: Category[] = []
  export let onPlayAgain: () => void = () => {}

  function generateShareText(): string {
    const solvedEmojis = solvedCategories
      .map(cat => {
        const colorToEmoji: Record<string, string> = {
          '#f4d35e': '🟨',
          '#3aa655': '🟩',
          '#4a90e2': '🟦',
          '#b392f0': '🟪'
        }
        return colorToEmoji[cat.color] || '⬜'
      })
      .join('')

    return `Connections: ${solvedEmojis}`
  }

  function copyToClipboard(): void {
    const text = generateShareText()
    navigator.clipboard.writeText(text)
  }
</script>

{#if gameOver}
  <div
    class="modal-backdrop animate-backdrop-in"
    on:click={onPlayAgain}
    role="presentation"
  >
    <div class="modal animate-modal-in" role="alertdialog" aria-modal="true">
      {#if won}
        <h2 class="modal-title modal-title--win">You won!</h2>
        <p class="modal-subtitle">Puzzle solved!</p>
      {:else}
        <h2 class="modal-title modal-title--loss">Game Over</h2>
        <p class="modal-subtitle">Better luck tomorrow</p>
      {/if}

      {#if !won && unsolvedCategories.length > 0}
        <div class="unsolved-categories">
          <p class="unsolved-label">Unsolved:</p>
          {#each unsolvedCategories as category (category.name)}
            <div
              class="unsolved-category"
              style="background-color: {category.color}"
            >
              <div class="unsolved-content">
                <h4>{category.name}</h4>
                <p>{category.words.join(', ')}</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if won}
        <div class="modal-actions">
          <button class="modal-button modal-button--share" on:click={copyToClipboard}>
            Share Result
          </button>
        </div>
      {/if}

      <button class="modal-button modal-button--primary" on:click={onPlayAgain}>
        Play Again
      </button>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: var(--color-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal {
    background-color: var(--color-white);
    border-radius: 12px;
    padding: 32px 24px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .modal-title {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .modal-title--win {
    color: #3aa655;
  }

  .modal-title--loss {
    color: #ff6b6b;
  }

  .modal-subtitle {
    margin: 0 0 24px 0;
    font-size: 16px;
    color: var(--color-text-secondary);
  }

  .unsolved-categories {
    margin: 24px 0;
    text-align: left;
  }

  .unsolved-label {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .unsolved-category {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }

  .unsolved-content h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
  }

  .unsolved-content p {
    margin: 0;
    font-size: 12px;
    opacity: 0.95;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .modal-button {
    padding: 14px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms ease-out;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .modal-button--primary {
    width: 100%;
    background-color: var(--color-dark);
    color: var(--color-white);
  }

  .modal-button--primary:active {
    transform: scale(0.95);
    background-color: #555;
  }

  .modal-button--share {
    flex: 1;
    background-color: var(--color-gray);
    color: var(--color-text-primary);
  }

  .modal-button--share:active {
    background-color: #bbb;
  }

  @media (hover: hover) {
    .modal-button--primary:hover {
      background-color: #555;
    }

    .modal-button--share:hover {
      background-color: #bbb;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .modal {
      padding: 40px 32px;
    }

    .modal-title {
      font-size: 32px;
    }

    .modal-subtitle {
      font-size: 18px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .modal {
      padding: 48px 40px;
    }

    .modal-title {
      font-size: 36px;
    }
  }
</style>
