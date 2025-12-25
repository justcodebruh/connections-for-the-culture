<script lang="ts">
  export let words: string[] = []
  export let onDeselect: (word: string) => void = () => {}

  function handleDeselect(word: string): void {
    onDeselect(word)
  }
</script>

{#if words.length > 0}
  <div class="selected-words">
    {#each words as word (word)}
      <div class="selected-word animate-word-enter" key={word}>
        <span>{word}</span>
        <button
          class="remove-button"
          on:click={() => handleDeselect(word)}
          aria-label="Remove {word} from selection"
        >
          ×
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .selected-words {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
    min-height: 24px;
  }

  .selected-word {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--color-dark);
    color: var(--color-white);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    animation: wordEnter 150ms ease-out forwards;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .remove-button {
    background: none;
    border: none;
    color: var(--color-white);
    cursor: pointer;
    font-size: 20px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 150ms ease-out;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    margin-left: 4px;
  }

  .remove-button:active {
    opacity: 0.6;
  }

  @media (hover: hover) {
    .remove-button:hover {
      opacity: 0.7;
    }
  }

  @keyframes wordEnter {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .selected-word {
      padding: 8px 14px;
      font-size: 15px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .selected-word {
      padding: 10px 16px;
      font-size: 16px;
    }
  }
</style>
