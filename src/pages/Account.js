import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  Stack,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const Account = ({onResetProject}) => {
  onResetProject(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData({
        username: response.data.username,
        email: response.data.email || '',
      });
    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/users/me/`, {
        email: userData.email,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/users/change-password/`, {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password changed successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mt: '130px', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <form onSubmit={handleUpdateProfile}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                value={userData.username}
                disabled
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ width: '200px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <form onSubmit={handlePasswordChange}>
            <Stack spacing={3}>
              <TextField
                label="Current Password"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ width: '200px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError('');
          setSuccess('');
        }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Account;