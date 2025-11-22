import axios from 'axios';

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'admin@example.com',
            password: 'admin123'
        });
        console.log('Login Successful:', response.data);
    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
};

testLogin();
