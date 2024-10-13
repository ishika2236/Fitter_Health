import axios from 'axios';
const signinRequest = async(formData) =>{
    localStorage.setItem('email',formData.email);
    const response = await axios.post('http://localhost:8080/auth/signin', formData);
    console.log(response.data); 
}
export default signinRequest;