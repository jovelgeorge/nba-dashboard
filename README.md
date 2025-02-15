# NBA Minutes Adjuster Dashboard

A React-based dashboard for adjusting NBA player minutes and visualizing the impact on team statistics.

## Features

- Team selection via interactive buttons
- Real-time stat adjustments based on minutes changes
- Individual player minutes adjustment with slider and manual input
- Expandable player cards showing detailed statistics
- Team total tracking with 240-minute validation
- Visual feedback for stat changes (positive/negative)
- Responsive design for all screen sizes

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui components
- Papa Parse (CSV parsing)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nba-minutes-adjuster.git
   cd nba-minutes-adjuster
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Place your data file:

   - Add your CSV file (UA_20250130.csv) to the `public/data` directory
   - CSV should contain columns: PlayerId, Player, Team, Position, Minutes, and stat categories (Points, Rebounds, etc.)

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   └── features/
│       └── minutes-adjuster/
│           ├── minutes-adjuster.tsx
│           ├── player-card.tsx
│           └── stat-display.tsx
├── lib/
│   ├── types/
│   │   └── minutes-adjuster.ts
│   └── utils/
│       └── minutes-adjuster.ts
└── app/
    └── page.tsx
```

## Data Format

The CSV file should follow this structure:

```csv
PlayerId,Player,Team,Position,Minutes,Points,Rebounds,Assists,Steals,Blocks,Turnovers,3PM
1,John Doe,LAL,PG,32.5,18.2,4.5,7.8,1.2,0.3,2.1,2.4
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
