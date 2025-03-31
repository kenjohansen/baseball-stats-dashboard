import { API_URL } from '../config';
import { Player } from '../types/Player';

// Sample mock data
const mockPlayers: Player[] = [
  {
    id: 1,
    Player: "Mike Trout",
    AgeThatYear: "29",
    Hits: 147,
    Year: 2021,
    Bats: "319",
    Rank: "15",
    HomeRuns: 39,
    RBI: 104
  },
  {
    id: 2,
    Player: "Mookie Betts",
    AgeThatYear: "28",
    Hits: 142,
    Year: 2021,
    Bats: "301",
    Rank: "2",
    HomeRuns: 29,
    RBI: 87
  }
];

// Mock API response functions
export const handlers = {
  // GET all players
  getPlayers: jest.fn().mockImplementation(() => {
    return Promise.resolve({ data: mockPlayers });
  }),

  // GET single player
  getPlayer: jest.fn().mockImplementation((id: number) => {
    const player = mockPlayers.find(p => p.id === id);
    
    if (!player) {
      return Promise.reject({ response: { status: 404 } });
    }
    
    return Promise.resolve({ data: player });
  }),

  // POST create player
  createPlayer: jest.fn().mockImplementation((player: Omit<Player, 'id'>) => {
    return Promise.resolve({ data: { ...player, id: 3 }, status: 201 });
  }),

  // PUT update player
  updatePlayer: jest.fn().mockImplementation((id: number, player: Player) => {
    const playerExists = mockPlayers.some(p => p.id === id);
    
    if (!playerExists) {
      return Promise.reject({ response: { status: 404 } });
    }
    
    return Promise.resolve({ data: { ...player, id } });
  }),

  // DELETE player
  deletePlayer: jest.fn().mockImplementation((id: number) => {
    const playerExists = mockPlayers.some(p => p.id === id);
    
    if (!playerExists) {
      return Promise.reject({ response: { status: 404 } });
    }
    
    return Promise.resolve({ status: 204 });
  })
};

// Export mock data for test usage
export { mockPlayers };
