<script lang="ts">
  export let remaining: number = 4
  export let mistakes: number = 0

  $: dots = Array(4).fill(0).map((_, i) => i < mistakes)
</script>

<div class="mistake-counter">
  <div class="dots">
    {#each dots as isMistake, i (i)}
      <div class="dot" class:mistake={isMistake} />
    {/each}
  </div>
  <p class="mistake-text">Mistakes remaining: {remaining}</p>
</div>

<style>
  .mistake-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    margin-bottom: 12px;
  }

  .dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-gray);
    transition: background-color 300ms ease-out;
  }

  .dot.mistake {
    background-color: #ff6b6b;
  }

  .mistake-text {
    margin: 0;
    font-size: 14px;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  /* Tablet */
  @media (min-width: 768px) {
    .dots {
      gap: 8px;
    }

    .dot {
      width: 14px;
      height: 14px;
    }

    .mistake-text {
      font-size: 15px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .mistake-text {
      font-size: 16px;
    }
  }
</style>
