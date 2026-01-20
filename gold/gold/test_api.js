const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({
    baseURL: 'http://localhost:8081/api',
    jar,
    withCredentials: true
}));

async function test() {
    try {
        console.log('1. Logging in...');
        const loginRes = await client.post('/auth/login', {
            email: 'demo@example.com',
            password: 'demo123'
        });
        console.log('Login success:', loginRes.data.success);

        console.log('2. Testing Profile Update...');
        const updateRes = await client.post('/auth/update', {
            name: 'Test User Node',
            phone: '9876543210',
            bio: 'Updated via script'
        });
        console.log('Update success:', updateRes.data.success);
        console.log('Updated User:', updateRes.data.user);

        console.log('3. Testing Chat...');
        const chatRes = await client.post('/chat/message', {
            message: 'Hello from script'
        });
        console.log('Chat response:', chatRes.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

test();
