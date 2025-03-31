/**
 * PlayerEditDialog Component
 * 
 * This component provides a dialog for editing baseball player information,
 * with form validation and save/cancel functionality.
 * 
 * Copyright (c) 2025 Ken Johansen. All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, Grid
} from '@mui/material';
import { Player } from '../types/Player';

interface PlayerEditDialogProps {
  open: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (player: Player) => void;
}

function PlayerEditDialog({ 
  open, 
  player, 
  onClose, 
  onSave 
}: PlayerEditDialogProps) {
  const [editedPlayer, setEditedPlayer] = useState<Player | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (player) {
      setEditedPlayer(player);
    } else {
      // Initialize with empty player object when creating a new player
      setEditedPlayer({
        id: 0,
        Player: '',
        AgeThatYear: '',
        Hits: 0,
        Year: new Date().getFullYear(),
        Bats: '',
        Rank: '',
        HomeRuns: 0,
        RBI: 0
      });
    }
  }, [player]);

  if (!editedPlayer) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate input
    let newErrors = { ...errors };
    
    if (name === 'Hits' || name === 'Year') {
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        newErrors[name] = `${name} must be a number`;
      } else {
        delete newErrors[name];
      }
    }
    
    setErrors(newErrors);
    setEditedPlayer({ ...editedPlayer, [name]: value });
  };

  const handleSubmit = () => {
    // Final validation before saving
    let isValid = true;
    let newErrors: Record<string, string> = {};
    
    if (!editedPlayer.Player.trim()) {
      newErrors.Player = 'Player name is required';
      isValid = false;
    }
    
    if (isNaN(parseInt(editedPlayer.Year.toString()))) {
      newErrors.Year = 'Year must be a valid number';
      isValid = false;
    }
    
    if (isNaN(parseInt(editedPlayer.Hits.toString()))) {
      newErrors.Hits = 'Hits must be a valid number';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (isValid) {
      // Convert string values to numbers where needed
      const processedPlayer = {
        ...editedPlayer,
        Year: parseInt(editedPlayer.Year.toString()),
        Hits: parseInt(editedPlayer.Hits.toString())
      };
      
      onSave(processedPlayer);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editedPlayer.id ? 'Edit Player' : 'Add New Player'}
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {editedPlayer.id !== 0 && (
              <Grid item xs={12}>
                <TextField
                  name="id"
                  label="ID"
                  value={editedPlayer.id}
                  fullWidth
                  disabled
                  margin="normal"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                name="Player"
                label="Player Name"
                value={editedPlayer.Player}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                error={!!errors.Player}
                helperText={errors.Player}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="Year"
                label="Year"
                value={editedPlayer.Year}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                error={!!errors.Year}
                helperText={errors.Year}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="AgeThatYear"
                label="Age"
                value={editedPlayer.AgeThatYear}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="Hits"
                label="Hits"
                value={editedPlayer.Hits}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                error={!!errors.Hits}
                helperText={errors.Hits}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="Bats"
                label="Batting Average"
                value={editedPlayer.Bats}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="Rank"
                label="Rank"
                value={editedPlayer.Rank}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerEditDialog;
