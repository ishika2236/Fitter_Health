const loginRequest = async(email, password) =>{
    const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
    });
    console.log('Login response:', response.data);
      // setIsOtpVisible(true);
    localStorage.setItem('token', response.data);
}

export default loginRequest;