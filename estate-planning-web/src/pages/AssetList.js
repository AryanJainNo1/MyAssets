import React, { useEffect, useState } from 'react';
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
  TextField,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets } from '../redux/slices/assetsSlice';
import AssetForm from '../components/AssetForm';
import api from '../services/api';

const AssetList = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.assets);
  const [openForm, setOpenForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filters, setFilters] = useState({
    asset_type: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchAssets(filters));
  }, [dispatch, filters]);

  const handleAddEdit = async (formData) => {
    try {
      if (selectedAsset) {
        await api.put(`/assets/${selectedAsset.id}/`, formData);
      } else {
        await api.post('/assets/', formData);
      }
      dispatch(fetchAssets(filters));
      setOpenForm(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${id}/`);
        dispatch(fetchAssets(filters));
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Assets</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedAsset(null);
            setOpenForm(true);
          }}
        >
          Add Asset
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Asset Type"
          value={filters.asset_type}
          onChange={(e) =>
            setFilters({ ...filters, asset_type: e.target.value })
          }
          sx={{ mr: 2, minWidth: 200 }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="REAL_ESTATE">Real Estate</MenuItem>
          <MenuItem value="VEHICLE">Vehicle</MenuItem>
          <MenuItem value="INVESTMENT">Investment</MenuItem>
          <MenuItem value="BANK_ACCOUNT">Bank Account</MenuItem>
          <MenuItem value="PERSONAL_PROPERTY">Personal Property</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="SOLD">Sold</MenuItem>
          <MenuItem value="TRANSFERRED">Transferred</MenuItem>
          <MenuItem value="DEPRECATED">Deprecated</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.asset_type_display}</TableCell>
                <TableCell align="right">
                  ${Number(asset.value).toLocaleString()}
                </TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>
                  <Chip
                    label={asset.status_display}
                    color={asset.status === 'ACTIVE' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedAsset(asset);
                      setOpenForm(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AssetForm
        open={openForm}
        handleClose={() => {
          setOpenForm(false);
          setSelectedAsset(null);
        }}
        initialData={selectedAsset}
        onSubmit={handleAddEdit}
      />
    </Box>
  );
};

export default AssetList; 