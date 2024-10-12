import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Lottie from 'react-lottie';
import fitnessAnimation from '../../public/fitnessAnimation.json'; // You'll need to provide this animation file

// Import your authentication components
import SignIn from './SignIn';
import Login from './Login';
import VerifyOTP from './OTPVerification';

// Styled components
const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
}));

const AnimationContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    zIndex: -1,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  overflowY: 'auto',
  maxHeight: '90vh',
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(4px)',
  borderRadius: theme.shape.borderRadius,
  border: '10px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.primary.contrastText,
  backdropFilter: 'blur(4px)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
  },
}));

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
    <LayoutContainer>
      <AnimationContainer>
        <Lottie options={defaultOptions} height="80%" width="80%" />
      </AnimationContainer>
      <FormContainer>
        <StyledPaper elevation={3}>
          {renderAuthComponent()}
        </StyledPaper>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <NavButton onClick={() => navigate('/signin')}>Sign Up</NavButton>
          <NavButton onClick={() => navigate('/login')}>Login</NavButton>
        </Box>
      </FormContainer>
    </LayoutContainer>
  );
};

export default AuthLayout;