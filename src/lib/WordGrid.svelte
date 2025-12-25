<script lang="ts">
  export let words: string[] = []
  export let selected: string[] = []
  export let onWordClick: (word: string) => void = () => {}
  export let isAnimating: boolean = false
  export let shakeAnimation: boolean = false

  function isSelected(word: string): boolean {
    return selected.includes(word)
  }

  function handleClick(word: string): void {
    if (!isAnimating) {
      onWordClick(word)
    }
  }
</script>

<div
  class="word-grid"
  class:shake={shakeAnimation}
>
  {#each words as word (word)}
    <button
      class="word-button"
      class:selected={isSelected(word)}
      on:click={() => handleClick(word)}
      disabled={isAnimating}
    >
      {word}
    </button>
  {/each}
</div>

<style>
  .word-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
    transition: transform 50ms ease-out;
  }

  .word-grid.shake {
    animation: gridShake 400ms ease-in-out;
  }

  .word-button {
    padding: 16px 12px;
    background-color: var(--color-gray);
    border: 2px solid transparent;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 150ms ease-out;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-primary);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .word-button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .word-button.selected {
    background-color: var(--color-dark);
    color: var(--color-white);
    border-color: #555;
  }

  .word-button:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  @media (hover: hover) {
    .word-button:hover:not(:disabled) {
      background-color: #bbb;
    }

    .word-button.selected:hover:not(:disabled) {
      background-color: #555;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .word-grid {
      gap: 10px;
    }

    .word-button {
      padding: 18px 14px;
      font-size: 15px;
      min-height: 48px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .word-grid {
      gap: 12px;
    }

    .word-button {
      padding: 20px 16px;
      font-size: 16px;
      min-height: 52px;
    }
  }
</style>
