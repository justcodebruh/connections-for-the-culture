<script lang="ts">
  import type { Category } from './types'

  export let category: Category
  export let solved = false
</script>

{#if solved}
  <div
    class="category-bar animate-category-pop"
    style="background-color: {category.color}"
  >
    <div class="category-content">
      <h3>{category.name}</h3>
      <p>{category.words.join(', ')}</p>
    </div>
  </div>
{/if}

<style>
  .category-bar {
    padding: 16px;
    border-radius: 6px;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .category-content h3 {
    margin: 0 0 6px 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .category-content p {
    margin: 0;
    font-size: 14px;
    opacity: 0.95;
    font-weight: 500;
  }

  @keyframes categoryPop {
    0% {
      transform: scale(0.8) translateY(-20px);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .category-bar {
      padding: 18px;
    }

    .category-content h3 {
      font-size: 17px;
    }

    .category-content p {
      font-size: 15px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .category-bar {
      padding: 20px;
    }

    .category-content h3 {
      font-size: 18px;
    }

    .category-content p {
      font-size: 16px;
    }
  }
</style>
