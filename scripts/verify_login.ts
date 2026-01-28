
import axios from 'axios';

async function verifyLogin() {
    const url = 'http://localhost:3001/api/auth/login';
    const credentials = {
        email: 'test@life-os.app',
        password: 'TestPass123!'
    };

    try {
        console.log(`Attempting login to ${url}...`);
        const response = await axios.post(url, credentials);
        console.log('Login successful!');
        console.log('Status:', response.status);
        console.log('User ID:', response.data.user.id);
    } catch (error: any) {
        console.error('Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

verifyLogin();
