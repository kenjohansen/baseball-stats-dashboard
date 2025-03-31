export interface Player {
  id: number;
  Player: string;
  AgeThatYear: string;
  Hits: number;
  HomeRuns: number;
  RBI: number;
  Year: number;
  Bats: string;
  Rank: string;
}

export interface PlayerWithDescription extends Player {
  description: string;
}
