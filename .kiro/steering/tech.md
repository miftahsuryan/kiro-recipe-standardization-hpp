# Tech Stack

## Core

- **Framework**: React + TypeScript (SPA)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router

## State Management

- **Client state**: Zustand — lightweight, used for UI state, HPP preview, filters
- **Server state**: TanStack Query (React Query) — fetching, caching, mutations, error handling

## Testing

- **Test runner**: Vitest (jsdom environment)
- **Component testing**: React Testing Library
- **Property-based testing**: fast-check (minimum 100 iterations per property)

## Export

- **PDF**: `jspdf` or `react-pdf`
- **CSV**: native Blob API

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Run tests (single run, no watch)
npx vitest --run

# Run tests with coverage
npx vitest --run --coverage

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Key Conventions

- All business logic (HPP calculation, validation, scaling) lives in **pure functions** — independently testable, no side effects
- Property tests must be tagged with: `// Feature: recipe-standardization-hpp, Property {N}: {description}`
- Currency formatting: Rupiah (Rp), 2 decimal places, Indonesian number format (`.` thousands, `,` decimal)
- Rounding: always use `Math.round(x * 100) / 100` for monetary values
- Debounce: 300ms for search inputs, ≤500ms for HPP live preview updates
