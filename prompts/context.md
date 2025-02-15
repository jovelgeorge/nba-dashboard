# Project Context

## Project Purpose

1. Allows manual adjustment of player minutes projections based on qualitative insights
2. Automatically scales individual player stats based on minutes changes
3. Maintains team-level projection integrity
4. Focuses on betting insights/edges through minutes projection adjustments

## Current Features

1. Interactive minutes adjustments per player
2. Statistical scaling (Points, Rebounds, Assists, Steals, Blocks, 3PM, Turnovers)
3. Team total tracking (240 minutes per team)
4. Visual feedback for changes (green/red indicators)
5. Display shows:
   - Raw stat values
   - Change amounts
   - Percentage changes
   - Team contribution percentages

## Technical Details

1. React-based interface using:
   - shadcn/ui components
   - Tailwind CSS
   - Papa Parse for CSV handling
2. Data structure:
   - CSV with player projections
   - Includes minutes, stats, and team assignments
   - All teams sum to 240 minutes

## Core Logic

1. Linear scaling of stats based on minutes changes
2. Team total maintenance
3. Percentage calculations for both individual and team-level changes

## Future Development Areas

1. Additional statistical categories
2. Data export functionality
3. Historical correlation analysis
4. Position-based minute redistribution
5. Game environment factors
6. Enhanced visualization options

**Important Note:**
The base projections already account for factors like spread, blowout risk, etc. The tool is specifically for manual adjustments based on qualitative insights, not for modifying the underlying statistical model.
