/**
 * PlayerViewDialog Component
 * 
 * This component displays detailed information about a baseball player,
 * including statistics and an AI-generated description.
 * 
 * Copyright (c) 2025 Ken Johansen. All rights reserved.
 */
import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, Paper
} from '@mui/material';
import { PlayerWithDescription } from '../types/Player';

interface PlayerViewDialogProps {
  open: boolean;
  player: PlayerWithDescription | null;
  onClose: () => void;
}

// Define the paper style as a constant
const paperStyle = {
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
};

// Use a simple function component without React.FC
function PlayerViewDialog({ open, player, onClose }: PlayerViewDialogProps) {
  if (!player) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          {player.Player}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {player.Year} Season
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Player Statistics
          </Typography>
          <Paper sx={paperStyle} elevation={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Age</Typography>
                <Typography variant="body1">{player.AgeThatYear}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Hits</Typography>
                <Typography variant="body1">{player.Hits}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Home Runs</Typography>
                <Typography variant="body1">{player.HomeRuns}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">RBI</Typography>
                <Typography variant="body1">{player.RBI}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Batting Average</Typography>
                <Typography variant="body1">{player.Bats}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Rank</Typography>
                <Typography variant="body1">{player.Rank}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            AI-Generated Player Description
          </Typography>
          <Paper sx={paperStyle} elevation={1}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {player.description}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              This description was generated using AI technology and may not be entirely accurate.
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlayerViewDialog;
