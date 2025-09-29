# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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