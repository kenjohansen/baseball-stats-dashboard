/**
 * PlayerEditDialog Component Tests
 * 
 * These tests verify the functionality of the PlayerEditDialog component,
 * including form validation, submission, and cancellation.
 * 
 * Copyright (c) 2025 Ken Johansen. All rights reserved.
 */
import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import userEvent from '@testing-library/user-event';
import PlayerEditDialog from './PlayerEditDialog';
import axios from 'axios';
import { Player } from '../types/Player';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Sample player data for testing
const samplePlayer: Player = {
  id: 1,
  Player: "Mike Trout",
  AgeThatYear: "29",
  Hits: 147,
  Year: 2021,
  Bats: "R",
  Rank: "15",
  HomeRuns: 39,
  RBI: 104
};

describe('PlayerEditDialog Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.put to return successful response
    mockedAxios.put.mockResolvedValue({ data: samplePlayer });
  });

  test('renders player edit form when open', () => {
    render(
      <PlayerEditDialog 
        open={true} 
        player={samplePlayer} 
        onClose={() => {}} 
        onSave={() => {}} 
      />
    );
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/player name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hits/i)).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
  
  test('does not render when not open', () => {
    render(
      <PlayerEditDialog 
        open={false} 
        player={samplePlayer} 
        onClose={() => {}} 
        onSave={() => {}} 
      />
    );
    
    // Check that the dialog is not rendered
    expect(screen.queryByLabelText(/player name/i)).not.toBeInTheDocument();
  });
  
  test('calls onClose when cancel button is clicked', () => {
    const handleClose = jest.fn();
    
    render(
      <PlayerEditDialog 
        open={true} 
        player={samplePlayer} 
        onClose={handleClose} 
        onSave={() => {}} 
      />
    );
    
    // Click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    // Check if onClose was called
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(mockedAxios.put).not.toHaveBeenCalled();
  });

  test('submits form data when valid', async () => {
    const handleSave = jest.fn();
    
    render(
      <PlayerEditDialog 
        open={true} 
        player={samplePlayer} 
        onClose={() => {}} 
        onSave={handleSave} 
      />
    );
    
    // Update a field
    const nameField = screen.getByLabelText(/player name/i);
    fireEvent.change(nameField, { target: { value: 'Shohei Ohtani' } });
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    // Check if onSave callback was called with updated player
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({ 
        Player: 'Shohei Ohtani',
        id: 1,
        Year: 2021,
        Hits: 147
      })
    );
  });

  test('validates form fields before submission', () => {
    const handleSave = jest.fn();
    
    render(
      <PlayerEditDialog 
        open={true} 
        player={samplePlayer} 
        onClose={() => {}} 
        onSave={handleSave} 
      />
    );
    
    // Clear required field
    const nameField = screen.getByLabelText(/player name/i);
    fireEvent.change(nameField, { target: { value: '' } });
    
    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    // Check if error message is displayed
    expect(screen.getByText(/player name is required/i)).toBeInTheDocument();
    
    // Check that onSave was not called
    expect(handleSave).not.toHaveBeenCalled();
  });

  test('updates form fields when player prop changes', () => {
    const { rerender } = render(
      <PlayerEditDialog 
        open={true} 
        player={samplePlayer} 
        onClose={() => {}} 
        onSave={() => {}} 
      />
    );
    
    // Check initial value
    expect(screen.getByDisplayValue('Mike Trout')).toBeInTheDocument();
    
    // Update player prop
    const updatedPlayer = { ...samplePlayer, Player: 'Shohei Ohtani' };
    
    rerender(
      <PlayerEditDialog 
        open={true} 
        player={updatedPlayer} 
        onClose={() => {}} 
        onSave={() => {}} 
      />
    );
    
    // Check updated value
    expect(screen.getByDisplayValue('Shohei Ohtani')).toBeInTheDocument();
  });
});
