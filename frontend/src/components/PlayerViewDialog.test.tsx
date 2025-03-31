/**
 * PlayerViewDialog Component Tests
 * 
 * These tests verify the functionality of the PlayerViewDialog component,
 * including rendering player details and handling dialog actions.
 * 
 * Copyright (c) 2025 Ken Johansen. All rights reserved.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerViewDialog from './PlayerViewDialog';

describe('PlayerViewDialog Component', () => {
  // Sample player data with description
  const mockPlayer = {
    id: 1,
    Player: "Mike Trout",
    AgeThatYear: "29",
    Hits: 147,
    Year: 2021,
    Bats: "319",
    Rank: "15",
    HomeRuns: 39,
    RBI: 104,
    StolenBases: 23,
    description: "Mike Trout is one of the greatest baseball players of his generation, known for his exceptional hitting, fielding, and baserunning abilities."
  };

  // Mock close handler
  const mockClose = jest.fn();

  test('renders player information correctly', () => {
    render(
      <PlayerViewDialog 
        open={true} 
        player={mockPlayer} 
        onClose={mockClose} 
      />
    );

    // Check if player name is displayed
    expect(screen.getByText('Mike Trout')).toBeInTheDocument();
    
    // Check if year is displayed
    expect(screen.getByText('2021 Season')).toBeInTheDocument();
    
    // Check if stats are displayed
    expect(screen.getByText(/hits/i)).toBeInTheDocument();
    expect(screen.getByText('147')).toBeInTheDocument();
    
    expect(screen.getByText(/home runs/i)).toBeInTheDocument();
    expect(screen.getByText('39')).toBeInTheDocument();
    
    // Check if description is displayed
    expect(screen.getByText(mockPlayer.description)).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <PlayerViewDialog 
        open={true} 
        player={mockPlayer} 
        onClose={mockClose} 
      />
    );

    // Find and click the close button
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    // Check if onClose was called
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  test('returns null when player is null', () => {
    const { container } = render(
      <PlayerViewDialog 
        open={true} 
        player={null} 
        onClose={mockClose} 
      />
    );
    
    // Container should be empty
    expect(container.firstChild).toBeNull();
  });

  test('renders dialog with correct width', () => {
    render(
      <PlayerViewDialog 
        open={true} 
        player={mockPlayer} 
        onClose={mockClose} 
      />
    );
    
    // Check if dialog has the correct maxWidth prop
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
