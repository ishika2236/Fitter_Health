import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null); 
    const [success, setSuccess] = useState(null); 
    const navigate = useNavigate();
    const handleOtpSubmit = async (e) => {
      e.preventDefault();
      console.log('Verifying OTP:', otp);

      try {
          const response = await axios.post('http://localhost:8080/auth/verify-otp', { otp });
          console.log('Response:', response.data);
          setSuccess('OTP verified successfully!'); 
          setError(null); 
          localStorage.setItem('token', response.data);
          navigate('/');
        
      } catch (err) {
          console.error('Error verifying OTP:', err);
          setError('Failed to verify OTP. Please try again.');
          setSuccess(null); 
      }
  };


  return (
    <Box sx={{ mt: 4 }}>
    <Typography variant="h5" gutterBottom>
      Verify OTP
    </Typography>
    <form onSubmit={handleOtpSubmit}>
      <TextField
        label="Enter OTP"
        variant="outlined"
        fullWidth
        margin="normal"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ mt: 2 }}
      >
        Verify OTP
      </Button>
      {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                {success && (
                    <Typography color="success.main" sx={{ mt: 2 }}>
                        {success}
                    </Typography>
                )}
    </form>
  </Box>
  )
}

export default OTPVerification;