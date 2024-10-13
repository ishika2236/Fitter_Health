import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import otpVerificationRequest from '../services/otpVerification';


const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null); 
    const [success, setSuccess] = useState(null); 
    const navigate = useNavigate();
    const handleOtpSubmit = async (e) => {
      e.preventDefault();
      console.log('Verifying OTP:', otp);
      try {
          const response = await otpVerificationRequest(otp);
          setSuccess('OTP verified successfully!');
          setError(null);
          navigate('/');
      } catch (err) {
          console.error('Error verifying OTP:', err);
          setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
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