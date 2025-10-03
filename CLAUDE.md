# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated**: 2025-10-04 (YYYY-MM-DD format)

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

MEMORU is a React-based Esperanto language learning application with three main learning modes.

### Core Architecture
- **React 19** with TypeScript and Vite
- **Tailwind CSS v4** for styling with existing CSS variables integration
- **Path Aliases**: `@/*` for clean imports from `src/`
- **Modular Routing**: Routes organized by feature (static, exam, topics, user)
- **Client-side routing** using React Router DOM

### Application Routes

**Static Routes** (`src/routes/staticRoutes.tsx`):
- `/` - Category selection (Top component)
- `/number-game` - Number game
- `/privacy-policy` - Privacy policy

**Exam Routes** (`src/routes/examRoutes.tsx`):
- `/range/:category` - Range selection for drill/esuken4
- `/quiz/:category/:rangeStart/:rangeSize` - Main quiz interface

**Topics Routes** (`src/routes/topicsRoutes.tsx`):
- `/interrogative-menu` - Interrogative word menu
- `/interrogative-explanation` - Interrogative explanation
- `/interrogative-basic` - Basic interrogative practice
- `/interrogative-advanced` - Advanced interrogative practice

**User Routes** (`src/routes/userRoutes.tsx`):
- `/weak-questions` - Saved weak questions list
- `/weak-questions-review` - Weak questions review quiz

### Data Access Layer

**DataService Pattern** (`src/services/data/`):
```typescript
// Centralized data access through DataService
const dataService = getDataService()
const words = dataService.getAllWords('esuken4')
const metadata = dataService.getDataSource('drill').getMetadata()
```

**Available Data Sources**:
- `VortaroDataSource` - Basic drill vocabulary (`src/data/vortaro.json`)
- `Esuken4DataSource` - Esperanto exam level 4 (`src/data/esuken4.json`)
- `InterrogativeDataSource` - Interrogative words (`src/data/interrogative-questions.json`)

**Data Formats**:
```typescript
// All data sources normalize to this interface
interface Word {
  esperanto: string
  japanese: string
  extra?: string
}

interface CategoryMetadata {
  id: CategoryId
  name: string
  emoji: string
  totalWords: number
}
```

### Type System Organization

**Centralized Types** (`src/types/`):
```
src/types/
├── index.ts              # Main export barrel
├── domain/               # Business logic types
│   ├── Word.ts          # Word, Category types
│   └── Quiz.ts          # Quiz engine types
└── ui/                  # UI component types
    ├── Display.ts       # Display/presentation types
    └── Quiz.ts          # Quiz UI types
```

**Import Pattern**:
```typescript
// ✅ Use path aliases for all imports
import type { QuizQuestion, Word } from '@/types'
import { useQuizEngine } from '@/hooks'
import { DataService } from '@/services'

// ❌ Avoid relative paths
import type { QuizQuestion } from '../../../types'
```

### Quiz System Architecture

**Unified Quiz Engine** (`src/hooks/useQuizEngine.ts`):
- Centralized quiz state management
- Two learning modes: Traditional (flashcard) and Multiple Choice
- Progress tracking and incorrect answer recording
- Configurable through `QuizEngineConfig`

**UnifiedQuiz Component** (`src/components/UnifiedQuiz/`):
- Container/View/Hook pattern
- `UnifiedQuiz.tsx` (23 lines) - Container connecting hook and view
- `UnifiedQuiz.view.tsx` (334 lines) - Pure presentation component
- `hooks/useUnifiedQuiz.ts` (115 lines) - Business logic layer

**Quiz Flow**:
1. Questions loaded via DataService
2. Shuffled and limited by useQuizEngine
3. User interacts in traditional or multiple-choice mode
4. Progress tracked, results calculated
5. Completion callbacks triggered

### Component Architecture Pattern

**Standard Structure**:
```
ComponentName/
├── ComponentName.tsx              # Container (connects hook + view)
├── ComponentName.view.tsx         # Presentation layer
├── ComponentName.types.ts         # Type definitions
├── ComponentName.test.tsx         # Component tests
├── ComponentName.stories.tsx      # Storybook stories
├── hooks/
│   ├── useComponentName.ts        # Business logic
│   └── useComponentName.test.tsx  # Hook tests
└── index.tsx                      # Public exports
```

**Example: UnifiedQuiz**:
```typescript
// UnifiedQuiz.tsx (Container - 23 lines)
export const UnifiedQuiz = (props: UnifiedQuizProps) => {
  const hookState = useUnifiedQuiz(props)
  return <UnifiedQuizView {...props} {...hookState} />
}

// hooks/useUnifiedQuiz.ts (Logic - 115 lines)
export const useUnifiedQuiz = (props) => {
  const { state, actions } = useQuizEngine(props.engineConfig)
  // ... business logic
  return { state, actions, computed values }
}

// UnifiedQuiz.view.tsx (View - 334 lines)
export const UnifiedQuizView = (props) => {
  // Pure presentation JSX
  return <div>...</div>
}
```

### State Management

**React Hooks Only** - No external state management libraries:
- `useQuizEngine` - Quiz state and logic
- Custom hooks for component-specific logic
- Context API for authentication (`AuthContext`)

**Key State Patterns**:
```typescript
// ✅ Derived state with useMemo
const filtered = useMemo(() =>
  data?.filter(item => item.active) ?? []
, [data])

// ✅ Computed values
const progress = Math.round((currentIndex / totalQuestions) * 100)

// ❌ Duplicate state (avoid)
const [data, setData] = useState([])
const [filteredData, setFilteredData] = useState([]) // Don't do this
```

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── UnifiedQuiz/    # Main quiz component (Container/View/Hook)
│   ├── QuizHeader/     # Quiz progress header
│   ├── ChoiceButtons/  # Multiple choice buttons
│   ├── AnswerResult/   # Answer feedback display
│   └── ...
├── pages/              # Route components
│   ├── Exam/          # Quiz and range selection
│   ├── Topics/        # Learning topics
│   ├── SavedQuestions/ # User's weak questions
│   └── ...
├── hooks/             # Global custom hooks
│   └── useQuizEngine.ts # Core quiz engine
├── services/          # Business logic layer
│   └── data/         # Data access services
├── types/            # Centralized type definitions
│   ├── domain/       # Business types
│   └── ui/           # UI types
├── utils/            # Utility functions
├── contexts/         # React contexts
├── routes/           # Route definitions
│   ├── index.tsx     # Main routes component
│   ├── staticRoutes.tsx
│   ├── examRoutes.tsx
│   ├── topicsRoutes.tsx
│   └── userRoutes.tsx
└── data/             # JSON datasets
```

## Code Quality Guidelines

### Testing Requirements
**All components, hooks, and utilities MUST have test files.**

```
✅ Required:
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
└── hooks/
    ├── useComponentName.ts
    └── useComponentName.test.tsx

❌ Prohibited:
ComponentName/
└── ComponentName.tsx  (no test file)
```

**Testing approach**:
- Create test file simultaneously with component creation
- Use TDD (Test-Driven Development) when possible
- Minimum requirements: rendering tests and props validation
- Hook tests use `renderHook` from `@testing-library/react`
- Run `npm test` before committing

**Test Examples**:
```typescript
// Component test
describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName {...requiredProps} />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})

// Hook test
describe('useComponentName', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useComponentName())
    expect(result.current.value).toBe(expectedValue)
  })
})
```

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

**Type Import Pattern**:
```typescript
// ✅ Import types from centralized location
import type { QuizQuestion, QuizMode } from '@/types'

// ❌ Don't re-export types unnecessarily
// ComponentName.types.ts
import type { QuizMode } from '@/types'
export type { QuizMode } // ❌ Unnecessary re-export
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
├── ComponentName.stories.tsx   # Storybook (REQUIRED for components)
├── hooks/
│   ├── useComponentName.ts     # Component-specific hooks
│   └── useComponentName.test.tsx # Hook tests (REQUIRED)
├── utils/
│   ├── helpers.ts              # Utility functions
│   └── helpers.test.ts         # Utility tests (REQUIRED)
└── index.tsx                   # Exports
```

**Notes**:
- Use lowercase `.view.tsx` for consistency with other extensions (`.types.ts`, `.test.tsx`, etc.)
- **All hooks and utility functions MUST have test files in the same directory**
- **All components MUST have Storybook stories** for visual testing and documentation
- Container components should be thin (20-50 lines) - just connecting hook and view

### Storybook Guidelines

**All components must have `.stories.tsx` files for:**
- Visual documentation of component patterns
- Isolated component testing
- Design system consistency

**Story requirements**:
```typescript
// Minimum required stories
export const Default: Story = {
  args: {
    // Basic props to show default state
  }
}

export const WithVariations: Story = {
  args: {
    // Show common variations (different props combinations)
  }
}
```

**Keep stories simple**:
- Focus on showing visual patterns, not complex interactions
- 2-4 stories per component is sufficient
- Use `args` for static examples
- Use `render` function only for interactive demos
- Add decorators for consistent styling/layout

**Example minimal story**:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    title: 'Example Title',
    subtitle: 'Example Subtitle',
  }
}

export const Loading: Story = {
  args: {
    loading: true,
  }
}
```

### Path Aliases

**Always use `@/` aliases for imports**:

```typescript
// ✅ Correct
import { useQuizEngine } from '@/hooks'
import { DataService } from '@/services'
import type { QuizQuestion } from '@/types'
import { Button } from '@/components/Button'

// ❌ Incorrect - Don't use relative paths
import { useQuizEngine } from '../../hooks'
import type { QuizQuestion } from '../../../types'
```

**Configuration files**:
- `tsconfig.app.json` - TypeScript path mapping
- `vite.config.ts` - Vite resolver
- `vitest.config.ts` - Test resolver
- `.storybook/main.ts` - Storybook resolver

### Code Review Checklist

Before submitting code, verify:

- [ ] Test file (.test.tsx) created
- [ ] Storybook story (.stories.tsx) created for components
- [ ] No `any` types used
- [ ] No eslint-disable without comments
- [ ] useEffect usage justified (can't use useMemo instead?)
- [ ] No duplicate state (single source of truth)
- [ ] Container/View properly separated
- [ ] Types defined in .types.ts file or imported from `@/types`
- [ ] Imports use `@/` aliases (not relative paths)
- [ ] Hook tests created for custom hooks

## Recent Refactoring (2025-10-04)

### Completed Improvements

1. **Data Access Layer** - Centralized data access via DataService pattern
2. **Type System Unification** - All types centralized in `src/types/`
3. **Routing Modularization** - Routes split into feature modules
4. **Path Aliases** - `@/*` aliases throughout codebase
5. **Component Separation** - UnifiedQuiz split into Container/View/Hook (370→23 lines)
6. **Type Cleanup** - Removed unnecessary re-exports from component `.types.ts` files

### Known Issues

- ESLint warnings for `react-refresh/only-export-components` in index.tsx files
- Storybook imports should use `@storybook/react-vite` instead of `@storybook/react`

### Next Steps

Consider these improvements:
- Split `useQuizEngine.ts` (298 lines) into smaller focused hooks
- Modularize `utils/firestore.ts` (169 lines) into service layer
- Implement code splitting for bundle size optimization
