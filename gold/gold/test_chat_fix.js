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
        console.log('1. Signing up...');
        try {
            await client.post('/auth/signup', {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });
            console.log('Signup success');
        } catch (e) {
            console.log('Signup failed (maybe already exists):', e.message);
        }

        console.log('2. Logging in...');
        await client.post('/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Login success');

        console.log('3. Testing City Rates...');
        const cityRes = await client.post('/chat/message', {
            message: 'Show me city-wise gold rates'
        });
        console.log('City Rates Response:', cityRes.data.response.substring(0, 100) + '...');
        if (cityRes.data.response.includes('Maharashtra') && cityRes.data.response.includes('Mumbai')) {
            console.log('✅ City Rates Check Passed');
        } else {
            console.log('❌ City Rates Check Failed');
        }

        console.log('4. Testing Clear Chat...');
        // Send another message to ensure history exists
        await client.post('/chat/message', { message: 'test message' });

        // Clear history
        await client.delete('/chat/history');
        console.log('Chat history cleared');

        // Get history
        const historyRes = await client.get('/chat/history');
        console.log('History length:', historyRes.data.length);
        if (historyRes.data.length === 0) {
            console.log('✅ Clear Chat Check Passed');
        } else {
            console.log('❌ Clear Chat Check Failed');
        }

    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Data:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

test();
