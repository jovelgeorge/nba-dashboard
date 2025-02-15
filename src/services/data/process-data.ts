import Papa from "papaparse";
import type { Player, DataSource } from "@/lib/types/minutes-adjuster";

type BaseCSVRow = {
  Player: string;
  Team: string;
  Position: string;
  Minutes: string | number;
  Points: string | number;
  Rebounds: string | number;
  Assists: string | number;
  Steals: string | number;
  Blocks: string | number;
  Turnovers: string | number;
};

type UnabatedCSVRow = BaseCSVRow & {
  "3PM": string | number;
  PlayerId?: string | number;
};

type EtrCSVRow = BaseCSVRow & {
  "Three Pointers": string | number;
};

const normalizeUnabatedData = (data: UnabatedCSVRow): Player => ({
  id: String(
    data.PlayerId ||
      `${data.Player}_${data.Team}`.replace(/\s+/g, "_").toLowerCase(),
  ),
  name: data.Player,
  team: data.Team,
  position: data.Position,
  originalMinutes: Number(data.Minutes) || 0,
  projectedMinutes: Number(data.Minutes) || 0,
  stats: {
    Points: Number(data.Points) || 0,
    Rebounds: Number(data.Rebounds) || 0,
    Assists: Number(data.Assists) || 0,
    Steals: Number(data.Steals) || 0,
    Blocks: Number(data.Blocks) || 0,
    Turnovers: Number(data.Turnovers) || 0,
    "3PM": Number(data["3PM"]) || 0,
  },
});

const normalizeEtrData = (data: EtrCSVRow): Player => ({
  id: `${data.Player}_${data.Team}`.replace(/\s+/g, "_").toLowerCase(),
  name: data.Player,
  team: data.Team,
  position: data.Position,
  originalMinutes: Number(data.Minutes) || 0,
  projectedMinutes: Number(data.Minutes) || 0,
  stats: {
    Points: Number(data.Points) || 0,
    Rebounds: Number(data.Rebounds) || 0,
    Assists: Number(data.Assists) || 0,
    Steals: Number(data.Steals) || 0,
    Blocks: Number(data.Blocks) || 0,
    Turnovers: Number(data.Turnovers) || 0,
    "3PM": Number(data["Three Pointers"]) || 0,
  },
});

const validateRow = (row: any, source: DataSource["name"]): boolean => {
  const requiredFields = ["Player", "Team", "Position", "Minutes"];
  return requiredFields.every((field) => Boolean(row[field]));
};

export const processCSVFile = async (
  file: File,
  source: DataSource["name"],
): Promise<Player[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("Parse errors:", results.errors);
          reject(new Error(results.errors[0].message));
          return;
        }

        try {
          console.log("Raw CSV data:", results.data[0]); // Debug log
          
          // Filter valid rows
          const validRows = results.data.filter((row) => validateRow(row, source));
          
          if (validRows.length === 0) {
            reject(new Error("No valid data rows found in CSV"));
            return;
          }

          // Process based on source
          const players = source === "ETR"
            ? validRows.map((row) => normalizeEtrData(row as EtrCSVRow))
            : validRows.map((row) => normalizeUnabatedData(row as UnabatedCSVRow));

          console.log("Processed player data:", players[0]); // Debug log
          resolve(players);
        } catch (error) {
          console.error("Processing error:", error);
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
};