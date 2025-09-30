# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated**: 2025-10-01 (YYYY-MM-DD format)

**Note**: When referencing dates in this project, always use the current date from the system environment.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview

# Deploy to Netlify (runs build)
npm run deploy

# Run tests
npm test

# Run tests with UI (optional)
npm run test:ui

# Run tests with coverage (optional)
npm run test:coverage

# Start Storybook
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Architecture Overview

MEMORU is a React-based Esperanto language learning application with three main learning modes:

### Core Architecture
- **React 19** with TypeScript and Vite
- **Tailwind CSS v4** for styling with existing CSS variables integration
- **Client-side routing** using React Router DOM with these routes:
  - `/` - Category selection (Top component)
  - `/range/:category` - Range selection for drill/esuken4
  - `/quiz/:category/:rangeStart/:rangeSize` - Main quiz interface
  - `/number-game` - Standalone number game

### Data Structure
Two distinct word data formats are normalized in Quiz.tsx:

**Drill format** (`src/data/vortaro.json`):
```json
{ "esperanto": "word", "japanese": "meaning" }
```

**Esuken4 format** (`src/data/esuken4.json`):
```json
{ "vorto": "word", "意味": "meaning", "意味続き": "extended_meaning" }
```

The `normalizeWords()` function in Quiz.tsx converts both formats to a common `Word` interface.

### Quiz System Design
The Quiz component handles two learning modes:
- **Traditional mode**: Click to reveal answers (flash card style)
- **Multiple choice mode**: 4-option quiz with immediate feedback

Key state management pattern:
- Quiz questions are shuffled from selected range (max 10 questions)
- Progress tracking with completion detection
- Incorrect answer recording for review
- Choice generation uses random selection from the full word set

### Number Game Architecture
Standalone component that converts numbers (1000-9999) to Esperanto using a decomposition algorithm:
- Breaks numbers into thousands, hundreds, tens, ones
- Maps to Esperanto number words via `esperantoNumbers` lookup
- Uses card-based selection interface

## Key Implementation Patterns

### Data Normalization
When adding new word categories, extend the `normalizeWords()` function in Quiz.tsx and add routing in App.tsx.

### State Management
Uses React hooks exclusively - no external state management. Quiz state includes:
- `questions`: Current shuffled question set
- `index`: Current question index
- `quizMode`: 'traditional' | 'multiple-choice'
- `incorrectQuestions`: Array of missed question indices

### Deployment Configuration
Deployed on Netlify with automatic builds from Git. Vite config uses base path `/` for all environments.

## File Organization
- `src/pages/` - Route components (Top, RangeSelect, Quiz, NumberGame)
- `src/data/` - JSON word datasets
- Main app logic resides in Quiz.tsx (350+ lines handling both quiz modes)

**Note**: This structure is being refactored. See `ARCHITECTURE_REFACTORING.md` for the new structure.

## Code Quality Guidelines

### Testing Requirements
**All components, hooks, and utilities MUST have test files.**

```
✅ Required:
ComponentName/
├── ComponentName.tsx
└── ComponentName.test.tsx

❌ Prohibited:
ComponentName/
└── ComponentName.tsx  (no test file)
```

**Testing approach**:
- Create test file simultaneously with component creation
- Use TDD (Test-Driven Development) when possible
- Minimum requirements: rendering tests and props validation
- Run `npm test` before committing

### Type Safety Rules
**The use of `any` type is prohibited.**

```typescript
❌ Prohibited:
const data: any = fetchData()
const item = (data as any).items[0]

✅ Required:
interface FetchResponse {
  items: Item[]
}
const data: FetchResponse = fetchData()
const item = data.items[0]

✅ Acceptable (with type guard):
function processData(data: unknown) {
  if (isValidData(data)) {
    return data.items
  }
}
```

### ESLint Compliance
**Do not disable ESLint rules without justification.**

```typescript
❌ Prohibited:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response

✅ Required:
// Fix the issue by defining proper types
interface ResponseData {
  items: Item[]
}
const data: ResponseData = response

✅ Acceptable (with explanation):
useEffect(() => {
  // actions has stable reference, intentionally excluded
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [questions])
```

### React Best Practices

**Minimize useEffect usage.**

```typescript
❌ Bad: Excessive useEffect
function Component() {
  const [data, setData] = useState(null)
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    setFiltered(data?.filter(...))
  }, [data])
}

✅ Good: Use useMemo for derived state
function Component() {
  const [data, setData] = useState(null)

  const filtered = useMemo(() =>
    data?.filter(...) ?? []
  , [data])
}
```

**When to use useEffect**:
1. Synchronization with external systems (API calls, localStorage, DOM manipulation)
2. Subscription management
3. Timers and event listeners

**When NOT to use useEffect**:
1. Derived state calculation → Use `useMemo`
2. Event handler logic → Implement directly
3. Props transformation → Calculate in component body

**State management principles**:
```typescript
✅ Good: Single source of truth
const [items, setItems] = useState([])
const selectedItem = useMemo(() =>
  items.find(item => item.id === selectedId)
, [items, selectedId])

❌ Bad: Duplicate state
const [items, setItems] = useState([])
const [selectedItem, setSelectedItem] = useState(null)
// Requires manual synchronization
```

### Component Structure

**Standard file pattern**:
```
ComponentName/
├── ComponentName.tsx           # Container (logic & state)
├── ComponentName.view.tsx      # View (presentation only)
├── ComponentName.types.ts      # Type definitions
├── ComponentName.test.tsx      # Tests (REQUIRED)
├── ComponentName.stories.tsx   # Storybook (optional)
├── hooks/
│   └── useComponentName.ts     # Component-specific hooks
└── index.tsx                   # Exports
```

**Note**: Use lowercase `.view.tsx` for consistency with other extensions (`.types.ts`, `.test.tsx`, etc.)

### Code Review Checklist

Before submitting code, verify:

- [ ] Test file (.test.tsx) created
- [ ] No `any` types used
- [ ] No eslint-disable without comments
- [ ] useEffect usage justified (can't use useMemo instead?)
- [ ] No duplicate state (single source of truth)
- [ ] Container/View properly separated
- [ ] Types defined in .types.ts file
- [ ] Imports organized and minimal