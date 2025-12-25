# Implementation Plan: NYT Connections UX/Design Parity

## Overview
Transform the Connections game clone into a one-to-one UX and design replica of the official NYT Connections game. Emphasis on mobile-first design with touch-friendly interactions and smooth animations.

---

## 1. Design & Color System

### Official NYT Colors
Replace sample puzzle data with NYT's official category colors:

| Difficulty | Color Name | Hex Code | CSS Variable |
|-----------|-----------|----------|--------------|
| Easiest | Yellow | `#f4d35e` | `--color-yellow` |
| Easy | Green | `#3aa655` | `--color-green` |
| Medium | Blue | `#4a90e2` | `--color-blue` |
| Hardest | Purple | `#b392f0` | `--color-purple` |
| Unsolved Tile | Gray | `#d3d3d3` | `--color-gray` |
| Selected Tile | Dark | `#333333` | `--color-dark` |

### Implementation
- Create CSS variables in root stylesheet for reusability
- Update puzzle category definitions to use these colors
- Apply color to solved category bars
- Ensure sufficient contrast for accessibility (WCAG AA)

---

## 2. Layout & Hierarchy

### Component Structure
```
<Game>
  <Header />
  <SolvedCategories />
  <WordGrid />
  <SelectedWords />
  <Controls />
  <MistakeCounter />
  <GameOverModal />
</Game>
```

### Layout Details

#### Header
- Title: "Connections" (larger on desktop)
- Subtitle: "Find groups of four related items"
- Mobile-first sizing with responsive scaling

#### Solved Categories Section
- Stack solved category bars at top (full width)
- Each bar displays category name + all 4 words
- Staggered animation on entry
- Removed from interactive area once solved

#### Word Grid
- 4x4 responsive grid
- Larger touch targets on mobile (44x44px minimum)
- Consistent spacing/padding
- Updates dynamically as categories are solved

#### Selected Words Display
- Shows all currently selected words (0-4)
- Individual removal buttons (× icon)
- Important visual feedback for mobile users
- Clear horizontal layout

#### Controls Section
- **Shuffle**: Randomize remaining words
- **Deselect All**: Clear selection with one tap
- **Submit**: Send selection for matching (disabled until 4 selected)
- Full-width buttons on mobile, side-by-side on desktop
- Consistent styling with game theme

#### Mistake Counter
- Display remaining attempts (4 max)
- Visual representation: dots, numbers, or icons
- Update in real-time after wrong guess
- Prominent positioning below grid

#### Game Over Modal
- Centered overlay with win/loss message
- "Play Again" button to reset
- Optional: Share button for solved puzzles

---

## 3. Touch & Mobile Interactions

### Touch-First Design
- All interactive elements minimum 44x44px touch target size
- Padding: `20px` (increased from `16px`) for better spacing
- Remove hover effects on touch devices; use active/focus states
- Add visual feedback for every tap (color change, scale)

### Interaction Patterns
- **Single Tap**: Select/deselect word
- **Tap Selected Word**: Remove from selection
- **Tap Shuffle**: Randomize grid
- **Tap Submit**: Validate selection
- **Tap Deselect All**: Clear all selections
- **Swipe to Shuffle** (optional): Left/right swipe randomizes words

### Haptic Feedback
- Trigger on successful word selection
- Trigger on wrong guess attempt
- Require feature detection (API may not be available)
- Graceful fallback for devices without haptics

---

## 4. Animations

### 4.1 Tile Selection Animation
**Trigger**: User taps unselected word
- **Duration**: 150ms
- **Effect**: 
  - Scale from 1 to 0.95
  - Background color transition to dark
  - Text color to white
  - Opacity fade

### 4.2 Tile Deselection Animation
**Trigger**: User taps selected word
- **Duration**: 150ms
- **Effect**:
  - Scale from 0.95 to 1
  - Background color to gray
  - Text color to black
  - Opacity fade

### 4.3 Solved Category Animation
**Trigger**: Correct group submitted
- **Duration**: 400ms total
- **Sequence**:
  1. Selected tiles scale down and fade out (200ms, staggered 50ms each)
  2. New category bar slides in from top (300ms, easing: ease-out)
  3. Remaining words reposition smoothly (spring animation)
  4. Optional: Confetti or subtle pulse on category bar

### 4.4 Incorrect Guess Animation
**Trigger**: Wrong group submitted
- **Duration**: 400ms
- **Effects**:
  - Grid shake: 3 oscillations left/right (±5px)
  - Tiles briefly flash category color (200ms)
  - Text overlay: "One away..." or "Not quite"
  - Selected words remain selected (for retry analysis)

### 4.5 Shuffle Animation
**Trigger**: Shuffle button clicked
- **Duration**: 300ms
- **Effect**:
  - Quick fade out of grid (100ms)
  - Reposition words
  - Fade back in (100ms)
  - Optional: Brief scale/rotation effect

### 4.6 Category Bar Pop
**Trigger**: First category solved
- **Duration**: 300ms
- **Effect**:
  - Spring animation: scale 0.8 → 1.1 → 1
  - Entrance from top
  - Bounce easing function

### 4.7 Game Over Animation
**Trigger**: Game ends (win/loss)
- **Duration**: 500ms
- **Effect**:
  - Fade overlay in
  - Modal scales up with bounce
  - Remaining unsolved categories displayed (loss scenario)

---

## 5. Component Changes

### **Game.svelte**
**New Functions:**
- `shuffleWords()`: Randomize remaining word order
- `triggerShakeAnimation()`: Apply shake effect to grid on wrong guess
- `triggerSolveAnimation()`: Coordinate animations when category solved
- `displayMessage()`: Show transient messages ("One away...", "Not quite")

**State Changes:**
- Add `isAnimating` flag to prevent interactions during animations
- Add `message` field for feedback text
- Add `messageTimeout` for auto-clearing messages

### **WordGrid.svelte**
**New Features:**
- Animation classes for entering/exiting tiles
- Shake animation trigger from parent
- Staggered entrance animation for tiles
- Update mobile breakpoints if needed

**Props:**
- `isAnimating`: boolean to disable clicks during animations
- `shakeAnimation`: trigger for shake effect

### **SelectedWords.svelte**
**Updates:**
- Add remove animation when word deselected
- Improve visual hierarchy on mobile
- Add transition animations

### **CategoryBar.svelte**
**New Features:**
- Pop/spring animation on entrance
- Smooth fade-in effect
- Display all 4 words clearly
- Apply solved category color with slight desaturation

### **New: Controls.svelte**
```
Props:
- selected: string[]
- onShuffle: () => void
- onDeselectAll: () => void
- onSubmit: () => void
- submitDisabled: boolean
- isAnimating: boolean

Features:
- Three buttons: Shuffle, Deselect All, Submit
- Responsive layout (stack on mobile, row on desktop)
- Disabled state styling
- Touch-friendly sizing
```

### **New: MistakeCounter.svelte**
```
Props:
- remaining: number
- mistakes: number

Features:
- Visual dots/circles (filled for mistakes, empty for remaining)
- Or numeric display: "2 mistakes remaining"
- Color coding: green → yellow → red as mistakes increase
- Smooth update animation
```

### **New: GameOverModal.svelte**
```
Props:
- gameOver: boolean
- won: boolean
- solvedCategories: Category[]
- unsolvedCategories: Category[]
- onPlayAgain: () => void

Features:
- Centered modal with backdrop
- Win: "You won! Puzzle solved!"
- Loss: Shows unsolved categories
- Share button (generates emoji grid)
- Play Again button
```

---

## 6. Visual Polish

### Typography
- **Mobile**: 
  - Title: 24px
  - Subtitle: 14px
  - Word tiles: 14px
  - Buttons: 16px
- **Desktop**:
  - Title: 32px
  - Subtitle: 16px
  - Word tiles: 16px
  - Buttons: 16px

### Spacing
- Consistent 12px gap in grid
- 20px padding in tiles
- 20px margin between major sections
- 16px padding in buttons

### Border Radius
- Tiles: `6px`
- Buttons: `8px`
- Category bars: `6px`
- Modal: `12px`

### Design System
- Flat design (minimal shadows)
- Consistent transition timing: 150ms for interactions, 300-400ms for major animations
- All interactive elements have :hover, :active, :focus states
- Accessibility: sufficient color contrast, clear focus indicators

### Dark Mode (Nice-to-Have)
- CSS variables for light/dark themes
- Respect `prefers-color-scheme` media query
- Test contrast ratios in both modes

---

## 7. Mobile-First CSS Structure

### Breakpoints
```css
/* Mobile First (320px - 767px) */
Base styles optimized for small screens

/* Tablet (768px - 1023px) */
Adjust grid, spacing, typography

/* Desktop (1024px+) */
Full layout with optional features
```

### Mobile Optimizations
- Full-width game container (padding: 16px)
- Single-column layout
- Large touch targets (44px minimum)
- Simplified header
- No hover effects (use :active instead)
- Optimized font sizes for readability

### Touch Device Detection
```javascript
// CSS classes for touch vs. non-touch
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
}
```

### Example Media Query Structure
```css
/* Mobile */
.word-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.word-button {
  padding: 16px 12px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 768px) {
  .word-grid {
    gap: 10px;
  }
  
  .word-button {
    padding: 18px 14px;
    font-size: 15px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .game-container {
    max-width: 600px;
  }
  
  .word-button {
    padding: 20px 16px;
    font-size: 16px;
  }
}
```

---

## 8. Additional Features (Phase 2)

### Phase 2A: Core Enhancements
- [ ] Keyboard shortcuts (desktop only):
  - Arrow keys to navigate
  - Enter to submit
  - Space to shuffle
  - Backspace to deselect
- [ ] Undo button (revert last guess)
- [ ] Statistics tracking (puzzles solved, streak)
- [ ] Local storage for game state

### Phase 2B: Social & Sharing
- [ ] Share button generates emoji grid
- [ ] Copy to clipboard functionality
- [ ] Share to social media (Twitter/Bluesky)
- [ ] Daily puzzle mode (show date)

### Phase 2C: Advanced
- [ ] Timer/speed mode
- [ ] Difficulty levels
- [ ] Custom puzzle creator
- [ ] Multiplayer/competitive mode
- [ ] Accessibility improvements (screen reader support)

---

## Implementation Priority

### Priority 1 (MVP - Must Have)
1. Official color scheme implementation
2. Responsive grid refinement
3. Solved category animation (slide up, fade out, pop in)
4. Shake animation for wrong guesses
5. Mobile touch optimizations
6. Button layout improvements (Controls component)
7. Mistake counter visual

### Priority 2 (Polish - Should Have)
1. Shuffle button + animation
2. Game over modal
3. Message feedback ("One away...", "Not quite")
4. Haptic feedback on touch
5. Improved hover/active states

### Priority 3 (Enhancement - Nice-to-Have)
1. Keyboard shortcuts
2. Undo button
3. Share functionality
4. Statistics/history
5. Dark mode support

---

## Testing Checklist

### Mobile Testing
- [ ] Touch interactions work on iOS
- [ ] Touch interactions work on Android
- [ ] No console errors on mobile
- [ ] Animations smooth (60fps target)
- [ ] Text readable without zoom
- [ ] Buttons easily tappable (44px+)
- [ ] No horizontal scrolling

### Desktop Testing
- [ ] Hover effects work properly
- [ ] Keyboard navigation works
- [ ] Responsive resizing works
- [ ] Animations smooth on all browsers

### Cross-Browser
- [ ] Chrome/Edge (latest)
- [ ] Safari (iOS & macOS)
- [ ] Firefox
- [ ] Mobile browsers (Chrome Android, Safari iOS)

### Accessibility
- [ ] WCAG AA color contrast
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Keyboard navigation complete

---

## File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Game.svelte          (updated)
│   │   ├── WordGrid.svelte       (updated)
│   │   ├── SelectedWords.svelte  (updated)
│   │   ├── CategoryBar.svelte    (updated)
│   │   ├── Controls.svelte       (new)
│   │   ├── MistakeCounter.svelte (new)
│   │   └── GameOverModal.svelte  (new)
│   ├── gameUtils.ts             (may add shuffle helper)
│   ├── types.ts                 (no changes)
│   └── styles/
│       ├── colors.css           (new - color variables)
│       ├── animations.css       (new - animation keyframes)
│       └── mobile.css           (new - mobile breakpoints)
├── app.css                      (update with new styles)
├── App.svelte
└── main.ts
```

---

## Notes

- All animations use `ease-out` or `cubic-bezier` for smooth, natural motion
- Animations are cancelable (user can click/tap during animation if needed)
- Accessibility first: animations should not interfere with usability
- Test animations on actual devices (performance matters on mobile)
- Consider reduced motion preferences (`prefers-reduced-motion`)

