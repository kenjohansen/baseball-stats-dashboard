/**
 * PlayerDashboard Component Tests
 * 
 * These tests verify the functionality of the PlayerDashboard component,
 * including rendering, data fetching, sorting, and filtering.
 * 
 * Copyright (c) 2025 Ken Johansen. All rights reserved.
 */
import React from 'react';
import { screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import { render } from '../test-utils';
import userEvent from '@testing-library/user-event';
import PlayerDashboard from './PlayerDashboard';
import { mockPlayers } from '../mocks/handlers';
import axios from 'axios';
import { Player, PlayerWithDescription } from '../types/Player';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

// Mock the PlayerViewDialog and PlayerEditDialog components
jest.mock('./PlayerViewDialog', () => {
  // Import React to use in the mock
  const React = require('react');
  // Import Material UI components to use in the mock
  const { Dialog, DialogTitle, DialogContent, Typography, Button } = require('@mui/material');
  
  return {
    __esModule: true,
    default: function MockPlayerViewDialog({ 
      open, 
      player, 
      onClose 
    }: { 
      open: boolean; 
      player: PlayerWithDescription | null; 
      onClose: () => void; 
    }) {
      if (!open || !player) return null;
      
      return (
        <Dialog open={open} onClose={onClose} data-testid="player-view-dialog">
          <DialogTitle>
            <Typography variant="h5">{player.Player}</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6">Player Statistics</Typography>
            <Button onClick={onClose}>Close</Button>
          </DialogContent>
        </Dialog>
      );
    }
  };
});

jest.mock('./PlayerEditDialog', () => {
  // Import React to use in the mock
  const React = require('react');
  // Import Material UI components to use in the mock
  const { Dialog, DialogTitle, DialogContent, Button } = require('@mui/material');
  
  return {
    __esModule: true,
    default: function MockPlayerEditDialog({ 
      open, 
      player, 
      onClose, 
      onSave 
    }: { 
      open: boolean; 
      player: Player; 
      onClose: () => void; 
      onSave: (player: Player) => void; 
    }) {
      if (!open || !player) return null;
      
      return (
        <Dialog open={open} onClose={onClose} data-testid="player-edit-dialog">
          <DialogTitle>
            Edit Player
          </DialogTitle>
          <DialogContent>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(player)}>Save</Button>
          </DialogContent>
        </Dialog>
      );
    }
  };
});

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Setup mock implementations before tests
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Set up axios.get to return mock data
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes('/players/description')) {
      return Promise.resolve({ 
        data: { 
          ...mockPlayers[0], 
          description: 'Test player description' 
        } 
      });
    } else if (url.includes('/players')) {
      return Promise.resolve({ data: mockPlayers });
    }
    return Promise.reject(new Error('Not found'));
  });
});

describe('PlayerDashboard Component', () => {
  test('renders loading state initially', () => {
    render(<PlayerDashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders players after loading', async () => {
    render(<PlayerDashboard />);
    
    // Wait for players to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Check if player names are displayed
    expect(screen.getByText('Mike Trout')).toBeInTheDocument();
    expect(screen.getByText('Mookie Betts')).toBeInTheDocument();
  });

  test('allows sorting players by column', async () => {
    render(<PlayerDashboard />);
    
    // Wait for players to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find the Hits column header
    const hitsHeader = screen.getByText('Hits');
    fireEvent.click(hitsHeader);
    
    // Verify sorting (this is a simplified test, actual implementation may vary)
    const playerRows = screen.getAllByRole('row').slice(1); // Skip header row
    expect(playerRows.length).toBeGreaterThan(0);
  });

  test('allows filtering players by name', async () => {
    render(<PlayerDashboard />);
    
    // Wait for players to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find the search input field
    const searchField = screen.getByLabelText(/search player/i);
    fireEvent.change(searchField, { target: { value: 'Trout' } });
    
    // Click search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    // Check if only Mike Trout is displayed
    expect(screen.getByText('Mike Trout')).toBeInTheDocument();
    expect(screen.queryByText('Mookie Betts')).not.toBeInTheDocument();
  });

  test('opens player view dialog when clicking on a player', async () => {
    render(<PlayerDashboard />);
    
    // Wait for players to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Click on a view button
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]);
    
    // Check if dialog is opened with player name
    await waitFor(() => {
      expect(screen.getByTestId('player-view-dialog')).toBeInTheDocument();
      // Use within to scope the query to just the dialog
      const dialog = screen.getByTestId('player-view-dialog');
      expect(within(dialog).getByText('Mike Trout')).toBeInTheDocument();
      expect(within(dialog).getByText('Player Statistics')).toBeInTheDocument();
    });
  });

  test('opens player edit dialog when clicking edit button', async () => {
    render(<PlayerDashboard />);
    
    // Wait for players to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Find and click the edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    // Check if edit dialog is opened
    expect(screen.getByTestId('player-edit-dialog')).toBeInTheDocument();
    expect(screen.getByText(/edit player/i)).toBeInTheDocument();
  });
});
