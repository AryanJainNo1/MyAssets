import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import api from '../services/api';

const WillList = () => {
  const navigate = useNavigate();
  const [wills, setWills] = useState([]);

  useEffect(() => {
    fetchWills();
  }, []);

  const fetchWills = async () => {
    try {
      const response = await api.get('/wills/');
      setWills(response.data);
    } catch (error) {
      console.error('Error fetching wills:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this will?')) {
      try {
        await api.delete(`/wills/${id}/`);
        fetchWills();
      } catch (error) {
        console.error('Error deleting will:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Wills</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/wills/create')}
        >
          Create New Will
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Executor</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wills.map((will) => (
              <TableRow key={will.id}>
                <TableCell>{will.title}</TableCell>
                <TableCell>
                  <Chip
                    label={will.status_display}
                    color={will.status === 'ACTIVE' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>{will.executor}</TableCell>
                <TableCell>
                  {new Date(will.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(will.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/wills/${will.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(will.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => window.open(`/api/wills/${will.id}/pdf/`)}
                  >
                    <PreviewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WillList; 