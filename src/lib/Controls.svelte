<script lang="ts">
  export let selected: string[] = []
  export let onShuffle: () => void = () => {}
  export let onDeselectAll: () => void = () => {}
  export let onSubmit: () => void = () => {}
  export let submitDisabled: boolean = false
  export let isAnimating: boolean = false
</script>

<div class="controls">
  <button
    class="control-button"
    on:click={onShuffle}
    disabled={isAnimating}
  >
    Shuffle
  </button>
  <button
    class="control-button"
    on:click={onDeselectAll}
    disabled={selected.length === 0 || isAnimating}
  >
    Deselect All
  </button>
  <button
    class="control-button control-button--submit"
    on:click={onSubmit}
    disabled={submitDisabled || isAnimating}
  >
    Submit
  </button>
</div>

<style>
  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-top: 16px;
    margin-bottom: 12px;
  }

  .control-button {
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background-color: var(--color-dark);
    color: var(--color-white);
    transition: all 200ms ease-out;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .control-button:active:not(:disabled) {
    transform: scale(0.95);
    background-color: #555;
  }

  .control-button:disabled {
    background-color: var(--color-gray);
    color: var(--color-text-secondary);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .control-button--submit {
    background-color: #555;
  }

  .control-button--submit:active:not(:disabled) {
    background-color: #333;
  }

  /* Hover effects only for non-touch devices */
  @media (hover: hover) {
    .control-button:hover:not(:disabled) {
      background-color: #555;
    }

    .control-button--submit:hover:not(:disabled) {
      background-color: #333;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .controls {
      gap: 10px;
      grid-template-columns: repeat(3, 1fr);
    }

    .control-button {
      padding: 14px 18px;
      font-size: 15px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .controls {
      gap: 12px;
    }

    .control-button {
      padding: 16px 20px;
      font-size: 16px;
    }
  }
</style>
