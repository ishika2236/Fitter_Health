import axios from 'axios';
const otpVerificationRequest = async (otp) => {
    try {
        const response = await axios.post('http://localhost:8080/auth/otpVerification', 
            {  otp },
            { withCredentials: true }
        );
        console.log('Response:', response.data);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export default otpVerificationRequest;