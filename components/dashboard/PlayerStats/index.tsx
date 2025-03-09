// components/dashboard/PlayerStats/index.tsx
/**
 * Player Statistics Components
 * This module exports all components related to player statistics display and manipulation.
 */

import type { Player } from '@/types';

// Component exports
export { PlayerList } from './PlayerList';
export { PlayerCard } from './PlayerCard';
export { MinutesInput } from './MinutesInput';

// Type exports
export interface PlayerListProps {
  players: Player[];
}

export interface PlayerCardProps {
  player: Player;
}

export interface MinutesInputProps {
  minutes: number;
  originalMinutes: number;
  onChange: (minutes: number) => void;
  validationError?: string | null;
}