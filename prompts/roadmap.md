# Project Roadmap

## Current Status

The NBA Minutes Adjuster is currently implemented as a client-side application with the following core features:

### Implemented Features

1. Multiple Projection Sources Support:

   - ETR and Unabated data sources
   - CSV file upload and parsing
   - Data normalization between sources
   - Source switching via dropdown

2. State Management:

   - Zustand store implementation
   - Player and team state management
   - Change history tracking
   - Real-time stat updates

3. UI Components:
   - Team selection interface
   - Player minutes adjustment
   - Statistical displays
   - Change logging
   - Error handling

## Planned Enhancements

1. Real-Time Updates:

   - WebSocket integration for live updates (first ETR, then attempt Unabated)
   - Auto-refresh capabilities
   - Projection version control with timestamps
   - Historical projection logging system
   - Injury/lineup news impact tracking

2. Projection Analysis Framework:

   - Historical projection logs with timestamps
   - Intraday projection change tracking
   - News event correlation (injuries, lineup changes)
   - Pattern identification in projection adjustments
   - Projected vs actual comparison analysis
   - Machine vs human adjustment accuracy tracking
   - Optimization recommendations based on contextual patterns

3. Statistical Analysis:

   - Team rotation patterns & history
   - Position-based analysis (minutes per position at both team & player level)
   - Projection accuracy metrics (R-squared, RMSE, etc.)
   - Historical correlation tracking
   - Position-based minute distribution (G/F/C) — accounting for positionless lineups
   - Pattern recognition in projection adjustments
   - Accuracy optimization for both automated and manual adjustments

4. Advanced Visualization:

   - Statistical trend graphs
   - Team comparison views
   - Projection adjustment timeline views
   - Historical accuracy visualization
   - Pattern analysis dashboards

5. UX:

   - Keyboard shortcuts
   - Dark/light theme toggle
   - Streamlined adjustment workflow
   - Pattern-based adjustment suggestions

6. Enhanced Data Sources:

   - Add data export functionality
   - Implement data validation rules
   - Historical data retention and analysis
   - News event integration

7. Reporting Features:
   - Custom report generation
   - Data export options
   - Change history analytics
   - Team composition analysis
   - Projection accuracy reports
   - Pattern identification reports

### Performance Optimization

1. Client-Side Optimization:

   - Component code splitting
   - Data caching strategies
   - Virtual scrolling for large datasets
   - Asset optimization
   - Historical data indexing

2. Data Processing:
   - Batch processing for large updates
   - Improved CSV parsing
   - Memory usage optimization
   - Error recovery mechanisms
   - Efficient historical data storage

## Technical Roadmap

### Current Architecture

- Next.js 13+ application
- TypeScript implementation
- Zustand state management
- shadcn/ui components
- Tailwind CSS styling
- Papa Parse for CSV handling

### Future Architecture Considerations

1. State Management:

   - Enhanced caching mechanisms
   - Optimistic updates
   - State persistence
   - Complex state derivations
   - Historical data management
   - Pattern analysis integration

2. Component Architecture:

   - Micro-frontend architecture
   - Component composition patterns
   - Enhanced error boundaries
   - Accessibility improvements
   - Time-series visualization components

3. Performance:
   - Code splitting strategies
   - Dynamic imports
   - Performance monitoring
   - Bundle size optimization
   - Historical data querying optimization
