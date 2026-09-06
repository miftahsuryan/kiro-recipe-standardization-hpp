# Project Structure

Follows a modified **Feature-Sliced Design (FSD)** pattern. Business logic is separated into pure functions; each feature owns its components, hooks, and types.

```
src/
├── app/                        # Router setup, global providers, global styles
│
├── features/
│   ├── recipes/                # Core recipe management
│   │   └── __tests__/
│   ├── ingredients/            # Ingredient price management
│   │   └── __tests__/
│   ├── versions/               # Version history & diff view
│   │   └── __tests__/
│   ├── export/                 # PDF & CSV export
│   │   └── __tests__/
│   └── cooking-guide/          # Step-by-step cooking overlay
│       └── __tests__/
│
├── shared/
│   ├── components/             # Reusable UI primitives (Button, Input, Modal, Toast, etc.)
│   ├── hooks/                  # Shared custom hooks (e.g. useDebounce)
│   ├── lib/
│   │   ├── calculations.ts     # Pure functions: calculateHPP, calculateSellingPrice, scaleRecipe, formatCurrency
│   │   ├── validators.ts       # Pure functions: validatePositiveNumber, validateMargin, validateTargetPortions, validateRecipeForm
│   │   ├── sort-filter.ts      # Pure functions: sortRecipes, filterRecipesByCategory, paginateRecipes, autocompleteFilter, reorderSteps
│   │   └── version-utils.ts    # Pure functions: diffRecipeVersions
│   │   └── __tests__/          # Property-based tests for all pure functions
│   └── types/
│       └── index.ts            # All TypeScript interfaces & enums (Ingredient, Recipe, HPPResult, etc.)
│
└── stores/
    ├── recipeStore.ts           # Zustand: recipes, activeRecipe, filter, hppPreview
    ├── ingredientStore.ts       # Zustand: ingredients, price propagation, inactive marking
    └── __tests__/
```

## Routing

| Path | Component |
|---|---|
| `/recipes` | `RecipeListPage` |
| `/recipes/new` | `RecipeFormPage` |
| `/recipes/:id` | `RecipeDetailPage` |
| `/recipes/:id/edit` | `RecipeFormPage` |
| `/recipes/:id/versions` | `VersionHistoryPage` |
| `/ingredients` | `IngredientManagementPage` |

## Key Placement Rules

- **Business logic** → `src/shared/lib/` as pure functions, never inside components or stores
- **Global types** → `src/shared/types/index.ts` only; no local type redefinitions
- **Zustand stores** → `src/stores/`; stores call pure functions from `shared/lib`, never duplicate logic
- **API/server-state** → TanStack Query hooks inside feature directories, not in stores
- **Shared UI primitives** → `src/shared/components/`; feature-specific components stay inside their feature folder
- **Tests** → co-located in `__tests__/` subdirectory next to the code being tested
