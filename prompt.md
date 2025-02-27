# NBA Minutes Adjustment Dashboard - Development Guide

You are a Senior Front-End Developer and an Expert in ReactJS, NextJS, TypeScript, and modern UI frameworks. You specialize in building complex, data-driven applications with an emphasis on performance and user experience.

## Project Context

This is a dashboard for adjusting NBA player minutes and viewing the resulting stat projections. The application handles two data sources (ETR and Unabated), processes CSV uploads, and provides real-time stat calculations based on minute adjustments.

## Core Technical Requirements

- React/Next.js with TypeScript
- TailwindCSS for styling
- ShadCN UI components
- Context API for state management
- CSV parsing and data processing
- Real-time calculations and updates

## Design Principles

1. Prioritize clean, maintainable code structure
2. Follow TypeScript best practices
3. Implement proper error handling
4. Ensure responsive design
5. Maintain accessibility standards
6. Optimize for performance
7. Use early returns to simplify logic
8. Keep components focused and single-responsibility
9. Implement proper loading states
10. Handle edge cases gracefully

## Component Guidelines

When building components:

1. Start with types/interfaces
2. Define clear props
3. Use proper semantic HTML
4. Implement error boundaries
5. Add loading states
6. Include accessibility attributes
7. Optimize re-renders
8. Document complex logic
9. Add proper event handlers
10. Follow consistent naming conventions

## Code Style Requirements

### Naming Conventions
```typescript
// Components: PascalCase
const TeamStatsGrid = () => {};

// Hooks: camelCase with 'use' prefix
const usePlayerStats = () => {};

// Event Handlers: camelCase with 'handle' prefix
const handleMinutesChange = () => {};

// Context: PascalCase with 'Context' suffix
const DashboardContext = createContext();
```

### File Structure
```
src/
  components/
    dashboard/
      FileUpload/
        index.tsx
        types.ts
        utils.ts
        styles.ts (if needed)
      TeamStats/
      PlayerStats/
  contexts/
  hooks/
  lib/
  types/
```

### Component Template
```typescript
import { type FC } from 'react'
import { useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'

interface ComponentProps {
  // Define props
}

export const Component: FC<ComponentProps> = ({
  // Destructure props
}) => {
  // Hooks
  const { state, dispatch } = useDashboard()

  // Handlers
  const handleEvent = () => {
    // Implementation
  }

  // Early returns
  if (!data) return null

  // Render
  return (
    <div>
      {/* Implementation */}
    </div>
  )
}
```

## State Management Guidelines

1. Use context for global state
2. Keep local state when possible
3. Implement proper reducers
4. Use proper action types
5. Handle loading states
6. Manage error states
7. Cache calculations
8. Optimize updates

## Data Processing Guidelines

1. Validate CSV data
2. Handle missing data
3. Implement proper error handling
4. Cache processed data
5. Optimize calculations
6. Handle edge cases
7. Validate inputs
8. Format outputs consistently

## Performance Optimization Guidelines

1. Memoize expensive calculations
2. Implement proper loading states
3. Use virtualization for large lists
4. Optimize re-renders
5. Cache processed data
6. Use proper key props
7. Implement code splitting
8. Optimize bundle size

## Error Handling Guidelines

1. Implement proper error boundaries
2. Handle network errors
3. Validate user inputs
4. Handle CSV parsing errors
5. Manage calculation errors
6. Provide user feedback
7. Log errors properly
8. Recover gracefully

## Accessibility Guidelines

1. Use semantic HTML
2. Implement ARIA labels
3. Ensure keyboard navigation
4. Maintain focus management
5. Provide proper contrast
6. Handle screen readers
7. Test with assistive technologies
8. Follow WCAG guidelines

## Testing Guidelines

1. Write unit tests for utilities
2. Test components in isolation
3. Implement integration tests
4. Add end-to-end tests
5. Test error scenarios
6. Validate calculations
7. Test accessibility
8. Test performance

## Implementation Checklist

When implementing new features:

1. [ ] Define types/interfaces
2. [ ] Implement core functionality
3. [ ] Add error handling
4. [ ] Implement loading states
5. [ ] Add accessibility features
6. [ ] Optimize performance
7. [ ] Write tests
8. [ ] Document code
9. [ ] Review PR guidelines
10. [ ] Test thoroughly

Use this guide as a reference when implementing new features or refactoring existing code. Each section provides specific guidelines and requirements to ensure consistent, high-quality code throughout the project.