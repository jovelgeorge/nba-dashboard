# Project Structure

## Directory Structure

```
nba-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── features/
│   │   │   └── minutes-adjuster/
│   │   │       ├── change-log.tsx
│   │   │       ├── file-upload.tsx
│   │   │       ├── minutes-adjuster.tsx
│   │   │       ├── player-card.tsx
│   │   │       ├── player-list.tsx
│   │   │       ├── stat-display.tsx
│   │   │       └── team-stats.tsx
│   │   ├── providers/
│   │   │   └── theme-provider.tsx
│   │   └── ui/
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── slider.tsx
│   │   │   └── switch.tsx
│   ├── lib/
│   │   ├── types/
│   │   │   └── minutes-adjuster.ts
│   │   └── utils/
│   │       ├── data-processing.ts
│   │       ├── minutes-adjuster.ts
│   │       └── utils.ts
│   ├── pages/
│   ├── services/
│   │   └── data/
│   │       └── process-data.ts
│   └── store/
│       └── minutes-adjuster/
│           └── store.ts
```

## Component Overview

### Core Components

1. `minutes-adjuster.tsx`

   - Main component orchestrating the minutes adjustment feature
   - Manages team selection and overall state

2. `file-upload.tsx`

   - Handles CSV file uploads
   - Supports multiple data sources
   - Implements file validation

3. `player-card.tsx`

   - Individual player display
   - Minutes adjustment controls
   - Stat visualization

4. `player-list.tsx`

   - Renders list of players
   - Implements sorting and filtering
   - Manages player selection

5. `stat-display.tsx`

   - Statistics visualization component
   - Handles percentage calculations
   - Shows differential values

6. `team-stats.tsx`

   - Team-level statistics
   - Minutes total tracking
   - Team comparison features

7. `change-log.tsx`
   - Tracks minutes adjustments
   - Displays modification history
   - Time-based logging

### State Management

- Zustand store implementation
- Centralized state logic
- Real-time updates
- Change tracking

### Utilities

1. `data-processing.ts`

   - CSV parsing logic
   - Data normalization
   - Source-specific processing

2. `minutes-adjuster.ts`

   - Core calculation logic
   - Statistical scaling
   - Team total validation

3. `utils.ts`
   - Common utility functions
   - Helper methods
   - Type guards

### Types

- Comprehensive TypeScript definitions
- Type safety enforcement
- Shared interfaces and types
