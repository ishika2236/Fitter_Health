import React from 'react'
import { Container, Button, ButtonGroup, Typography, TextField, Box } from '@mui/material';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import signinRequest from '../services/signup';
import './SignIn.css'
const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
      ...theme.applyStyles('dark', {
        backgroundColor: '#30404d',
      }),
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
      ...theme.applyStyles('dark', {
        background: 'rgba(57,75,89,.5)',
      }),
    },
    ...theme.applyStyles('dark', {
      boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
      backgroundColor: '#394b59',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
    }),
  }));
function BpRadio(props) {
    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        {...props}
      />
    );
  }
  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  });
const SignIn = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        fitnessGoals: '',
        workoutLevel: ''
    });
    const handlePassword = (e)=>{
        setConfirmPassword(e.target.value);
        // if(formData.password !== confirmPassword)
        // {
        //     setPasswordMatchError(true);
        // }
    }
    const handleNext = () => {
        setPage((prev) => prev + 1);
    };
    
    const handleBack = () => {
        setPage((prev) => prev - 1);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            signinRequest(formData);
            navigate('/verify-otp')
        } catch (error) {
            console.error(error);  
        }
        finally {
            setIsSubmitting(false);
        }
    };
  return (
    <div>
        <Container>
            <Typography variant='h4' gutterBottom>
                Sign In
            </Typography>

            {page === 0 && (
                <Box>
                    <TextField
                        label="Username"
                        name="username"
                        variant="outlined"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        variant="outlined"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type='password'
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirm password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={handlePassword}
                        fullWidth
                        margin="normal"
                        type='password'
                    />
                    {passwordMatchError && <Typography variant='h6' color='red' gutterBottom>
                        Passwords dont match
                    </Typography>}
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        Next
                    </Button>

                </Box>
            )}
            {page == 1 && (
                <Box>
                    <Typography variant='h4'>
                        Personal Details
                    </Typography>
                    <TextField
                        label="Age"
                        name="age"
                        variant="outlined"
                        value={formData.age}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Height"
                        name="height"
                        variant="outlined"
                        value={formData.height}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl>
                        <FormLabel id="demo-customized-radios">Gender</FormLabel>
                        <RadioGroup
                            defaultValue="Female"
                            aria-labelledby="demo-customized-radios"
                            name="customized-radios"
                            onChange={handleChange}
                            className='gender-toggle-btns'
                        >
                            <FormControlLabel value="Female" control={<BpRadio />} label="Female" />
                            <FormControlLabel value="Male" control={<BpRadio />} label="Male" />
                            <FormControlLabel disable value="other" control={<BpRadio />} label="Other" />
                        </RadioGroup>
                        </FormControl>
                        <TextField
                            label="Weight"
                            name="weight"
                            variant="outlined"
                            value={formData.weight}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleBack}>
                            Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Next
                        </Button>
                </Box>
            )}
            {page == 2 && (
                <Box>
                    <FormControl component="fieldset">
                    <FormLabel id="workout-level-label">Workout Level</FormLabel>
                    <ButtonGroup
                        orientation="vertical"
                        aria-labelledby="workout-level-label"
                        fullWidth
                    >
                        <Button
                        variant={formData.workoutLevel === 'beginner' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Beginner</Typography>
                            <Typography variant="body2">Start with basic exercises and foundational movements.</Typography>
                        </Box>
                        </Button>

                        <Button
                        variant={formData.workoutLevel === 'intermediate' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Intermediate</Typography>
                            <Typography variant="body2">Increase intensity and build on your foundational skills.</Typography>
                        </Box>
                        </Button>

                        <Button
                        variant={formData.workoutLevel === 'advanced' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Advanced</Typography>
                            <Typography variant="body2">Challenge yourself with advanced training techniques.</Typography>
                        </Box>
                        </Button>
                    </ButtonGroup>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <FormLabel id="fitness-goals-label">Fitness Goals</FormLabel>
                    <ButtonGroup
                        orientation="vertical"
                        aria-labelledby="fitness-goals-label"
                        fullWidth
                    >
                        <Button
                        variant={formData.fitnessGoals === 'lose-weight' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Lose Weight</Typography>
                            <Typography variant="body2">Focus on calorie burning and fat loss through cardio and strength training.</Typography>
                        </Box>
                        </Button>

                        <Button
                        variant={formData.fitnessGoals === 'gain-muscle' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Gain Muscle</Typography>
                            <Typography variant="body2">Build strength and muscle mass with weight training.</Typography>
                        </Box>
                        </Button>

                        <Button
                        variant={formData.fitnessGoals === 'improve-stamina' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Improve Stamina</Typography>
                            <Typography variant="body2">Enhance endurance and energy through consistent cardio exercises.</Typography>
                        </Box>
                        </Button>

                        <Button
                        variant={formData.fitnessGoals === 'flexibility' ? 'contained' : 'outlined'}
                        onClick={handleChange}
                        >
                        <Box>
                            <Typography variant="h6">Increase Flexibility</Typography>
                            <Typography variant="body2">Improve mobility and flexibility through stretching and yoga.</Typography>
                        </Box>
                        </Button>
                    </ButtonGroup>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                        disabled={isSubmitting} 
                        >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>

                </Box>
            )}
        </Container>
    </div>
  )
}

export default SignIn;