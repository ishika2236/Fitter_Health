import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Button, Typography } from '@mui/material';
import Lottie from 'react-lottie';
import fitnessAnimation from '../../public/fitnessAnimation.json'; // You'll need to provide this animation file

// Import your authentication components
import SignIn from './SignIn';
import Login from './Login';
import VerifyOTP from './OTPVerification';

import './AuthLayout.css'; // Import the CSS file

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fitnessAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const renderAuthComponent = () => {
    switch (location.pathname) {
      case '/signin':
        return <SignIn onSignInSuccess={(email) => {
          setEmail(email);
          navigate('/verify-otp');
        }} />;
      case '/login':
        return <Login onLoginSuccess={(email) => {
          setEmail(email);
          navigate('/verify-otp');
        }} />;
      case '/verify-otp':
        return <VerifyOTP email={email} onVerificationSuccess={() => {
          navigate('/dashboard');
        }} />;
      default:
        return <SignIn onSignInSuccess={(email) => {
          setEmail(email);
          navigate('/verify-otp');
        }} />;
    }
  };

  return (
    <div className="layout-container">
      <div className="animation-container">
        <Lottie options={defaultOptions} height="80%" width="80%" />
      </div>
      <div className="form-container">
        <Paper className="styled-paper" elevation={3}>
          {renderAuthComponent()}
        </Paper>
        <Box className="nav-button-container">
          <Button className="nav-button" onClick={() => navigate('/signin')}>Sign Up</Button>
          <Button className="nav-button" onClick={() => navigate('/login')}>Login</Button>
        </Box>
      </div>
    </div>
  );
};

export default AuthLayout;