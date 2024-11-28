import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import api from '../services/api';

const SecurityDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [filters, setFilters] = useState({
    action: '',
    start_date: null,
    end_date: null,
    user_id: '',
  });

  useEffect(() => {
    fetchAuditLogs();
    fetchStatistics();
    fetchPerformanceMetrics();
  }, [filters]);

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.start_date) params.append('start_date', filters.start_date.toISOString());
      if (filters.end_date) params.append('end_date', filters.end_date.toISOString());
      if (filters.user_id) params.append('user_id', filters.user_id);

      const response = await api.get(`/security/audit-logs/?${params}`);
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/security/audit-logs/statistics/');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await api.get('/security/data-access-logs/performance-metrics/');
      setPerformanceMetrics(response.data);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Security Dashboard
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              label="Action Type"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              <MenuItem value="">All Actions</MenuItem>
              <MenuItem value="CREATE">Create</MenuItem>
              <MenuItem value="UPDATE">Update</MenuItem>
              <MenuItem value="DELETE">Delete</MenuItem>
              <MenuItem value="VIEW">View</MenuItem>
              <MenuItem value="LOGIN">Login</MenuItem>
              <MenuItem value="LOGOUT">Logout</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <DatePicker
              label="Start Date"
              value={filters.start_date}
              onChange={(date) => setFilters({ ...filters, start_date: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <DatePicker
              label="End Date"
              value={filters.end_date}
              onChange={(date) => setFilters({ ...filters, end_date: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              onClick={() => setFilters({
                action: '',
                start_date: null,
                end_date: null,
                user_id: '',
              })}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Actions
              </Typography>
              <Typography variant="h4">
                {statistics?.total_actions || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Recent Activity (30d)
              </Typography>
              <Typography variant="h4">
                {statistics?.recent_activity || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Response Time
              </Typography>
              <Typography variant="h4">
                {performanceMetrics?.average_response_time?.toFixed(2) || 0}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Actions by Type
            </Typography>
            <ResponsiveContainer>
              <BarChart data={statistics?.actions_by_type || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Response Time Trends
            </Typography>
            <ResponsiveContainer>
              <LineChart data={performanceMetrics?.endpoint_usage || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Audit Logs Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell>{log.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SecurityDashboard; 