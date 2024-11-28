import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import api from '../services/api';

const steps = [
  'Basic Information',
  'Executor Details',
  'Add Beneficiaries',
  'Asset Distribution',
  'Review & Sign',
];

const WillCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [assets, setAssets] = useState([]);
  const [willData, setWillData] = useState({
    title: '',
    status: 'DRAFT',
    executor: '',
    executor_contact: '',
    witness_1_name: '',
    witness_2_name: '',
    beneficiaries: [],
    notes: '',
    signed_date: null,
  });

  useEffect(() => {
    if (id) {
      fetchWillData();
    }
    fetchAssets();
  }, [id]);

  const fetchWillData = async () => {
    try {
      const response = await api.get(`/wills/${id}/`);
      setWillData(response.data);
    } catch (error) {
      console.error('Error fetching will data:', error);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets/');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await api.put(`/wills/${id}/`, willData);
      } else {
        await api.post('/wills/', willData);
      }
      navigate('/wills');
    } catch (error) {
      console.error('Error saving will:', error);
    }
  };

  const handleAddBeneficiary = () => {
    setWillData({
      ...willData,
      beneficiaries: [
        ...willData.beneficiaries,
        {
          name: '',
          relationship: '',
          contact_info: '',
          percentage_share: 0,
          specific_assets: [],
        },
      ],
    });
  };

  const handleRemoveBeneficiary = (index) => {
    const newBeneficiaries = willData.beneficiaries.filter((_, i) => i !== index);
    setWillData({ ...willData, beneficiaries: newBeneficiaries });
  };

  const updateBeneficiary = (index, field, value) => {
    const newBeneficiaries = [...willData.beneficiaries];
    newBeneficiaries[index] = {
      ...newBeneficiaries[index],
      [field]: value,
    };
    setWillData({ ...willData, beneficiaries: newBeneficiaries });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Will Title"
                value={willData.title}
                onChange={(e) =>
                  setWillData({ ...willData, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={willData.status}
                onChange={(e) =>
                  setWillData({ ...willData, status: e.target.value })
                }
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="REVOKED">Revoked</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={willData.notes}
                onChange={(e) =>
                  setWillData({ ...willData, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Executor Name"
                value={willData.executor}
                onChange={(e) =>
                  setWillData({ ...willData, executor: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Executor Contact"
                value={willData.executor_contact}
                onChange={(e) =>
                  setWillData({ ...willData, executor_contact: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Button
              variant="contained"
              onClick={handleAddBeneficiary}
              sx={{ mb: 2 }}
            >
              Add Beneficiary
            </Button>
            <Grid container spacing={3}>
              {willData.beneficiaries.map((beneficiary, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Name"
                              value={beneficiary.name}
                              onChange={(e) =>
                                updateBeneficiary(index, 'name', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              select
                              label="Relationship"
                              value={beneficiary.relationship}
                              onChange={(e) =>
                                updateBeneficiary(
                                  index,
                                  'relationship',
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="SPOUSE">Spouse</MenuItem>
                              <MenuItem value="CHILD">Child</MenuItem>
                              <MenuItem value="PARENT">Parent</MenuItem>
                              <MenuItem value="SIBLING">Sibling</MenuItem>
                              <MenuItem value="FRIEND">Friend</MenuItem>
                              <MenuItem value="OTHER">Other</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Contact Info"
                              value={beneficiary.contact_info}
                              onChange={(e) =>
                                updateBeneficiary(
                                  index,
                                  'contact_info',
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Percentage Share"
                              value={beneficiary.percentage_share}
                              onChange={(e) =>
                                updateBeneficiary(
                                  index,
                                  'percentage_share',
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveBeneficiary(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Asset Distribution
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.asset_type_display}</TableCell>
                      <TableCell align="right">
                        ${Number(asset.value).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          fullWidth
                          value=""
                          onChange={() => {}}
                        >
                          {willData.beneficiaries.map((beneficiary, index) => (
                            <MenuItem key={index} value={index}>
                              {beneficiary.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Witness Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Witness 1 Name"
                value={willData.witness_1_name}
                onChange={(e) =>
                  setWillData({ ...willData, witness_1_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Witness 2 Name"
                value={willData.witness_2_name}
                onChange={(e) =>
                  setWillData({ ...willData, witness_2_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Signing Date"
                  value={willData.signed_date}
                  onChange={(newValue) =>
                    setWillData({ ...willData, signed_date: newValue })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Paper sx={{ p: 3, mt: 3 }}>
        {activeStep === steps.length ? (
          <Box>
            <Typography>All steps completed</Typography>
            <Button onClick={() => navigate('/wills')}>Return to Wills</Button>
          </Box>
        ) : (
          <Box>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" onClick={handleSubmit}>
                  Finish
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WillCreator; 