/**
 * PlayerDashboard Component
 * 
 * This component displays a table of baseball players with sorting, pagination,
 * and options to view details, edit, or delete players.
 * 
 * Copyright (c) 2025 Ken Johansen. All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, TablePagination, Box, TableSortLabel, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayerEditDialog from './PlayerEditDialog';
import PlayerViewDialog from './PlayerViewDialog';
import { Player, PlayerWithDescription } from '../types/Player';
import { API_URL } from '../config';

// Properly typed styled component to handle the component prop
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  width: '100%',
  marginTop: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
})) as typeof TableContainer;

function PlayerDashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerWithDescription, setPlayerWithDescription] = useState<PlayerWithDescription | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Player>('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/players`);
      setPlayers(response.data);
      setFilteredPlayers(response.data);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/players/description/${id}`);
      setPlayerWithDescription(response.data);
      setViewDialogOpen(true);
    } catch (err) {
      console.error('Error fetching player description:', err);
      setError('Failed to load player description. Please try again later.');
    }
  };

  const handleEdit = (player: Player | null) => {
    setSelectedPlayer(player || { 
      id: 0, 
      Player: '', 
      AgeThatYear: '', 
      Hits: 0, 
      HomeRuns: 0,
      RBI: 0,
      Year: new Date().getFullYear(), 
      Bats: '', 
      Rank: ''
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await axios.delete(`${API_URL}/players/${id}`);
        fetchPlayers();
      } catch (err) {
        console.error('Error deleting player:', err);
        setError('Failed to delete player. Please try again later.');
      }
    }
  };

  const handleSave = async (player: Player) => {
    try {
      if (player.id === 0) {
        // Generate a new ID for the player
        const maxId = Math.max(...players.map(p => p.id), 0);
        player.id = maxId + 1;
        await axios.post(`${API_URL}/players/${player.id}`, player);
      } else {
        await axios.put(`${API_URL}/players/${player.id}`, player);
      }
      setEditDialogOpen(false);
      fetchPlayers();
    } catch (err) {
      console.error('Error saving player:', err);
      setError('Failed to save player. Please try again later.');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Player) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = () => {
    const filtered = players.filter(player => 
      player.Player.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlayers(filtered);
    setPage(0);
  };

  const createSortHandler = (property: keyof Player) => () => {
    handleRequestSort(property);
  };

  const sortedPlayers = React.useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return order === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
      }
    });
  }, [filteredPlayers, order, orderBy]);

  if (loading && players.length === 0) {
    return <Typography variant="h6">Loading players...</Typography>;
  }

  if (error && players.length === 0) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box component="div">
      <Typography variant="h4" gutterBottom>
        Baseball Player Statistics
      </Typography>
      
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Search Player"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleEdit(null)}
        >
          Add Player
        </Button>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={createSortHandler('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Player'}
                  direction={orderBy === 'Player' ? order : 'asc'}
                  onClick={createSortHandler('Player')}
                >
                  Player
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Year'}
                  direction={orderBy === 'Year' ? order : 'asc'}
                  onClick={createSortHandler('Year')}
                >
                  Year
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'AgeThatYear'}
                  direction={orderBy === 'AgeThatYear' ? order : 'asc'}
                  onClick={createSortHandler('AgeThatYear')}
                >
                  Age
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Hits'}
                  direction={orderBy === 'Hits' ? order : 'asc'}
                  onClick={createSortHandler('Hits')}
                >
                  Hits
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Bats'}
                  direction={orderBy === 'Bats' ? order : 'asc'}
                  onClick={createSortHandler('Bats')}
                >
                  Bats
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'Rank'}
                  direction={orderBy === 'Rank' ? order : 'asc'}
                  onClick={createSortHandler('Rank')}
                >
                  Rank
                </TableSortLabel>
              </TableCell>
              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.Player}</TableCell>
                  <TableCell>{player.Year}</TableCell>
                  <TableCell>{player.AgeThatYear}</TableCell>
                  <TableCell>{player.Hits}</TableCell>
                  <TableCell>{player.Bats}</TableCell>
                  <TableCell>{player.Rank}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleView(player.id)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(player)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(player.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPlayers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledTableContainer>

      {/* View Dialog */}
      <PlayerViewDialog 
        open={viewDialogOpen}
        player={playerWithDescription}
        onClose={() => setViewDialogOpen(false)}
      />

      {/* Edit Dialog */}
      <PlayerEditDialog
        open={editDialogOpen}
        player={selectedPlayer}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );

}

export default PlayerDashboard;
