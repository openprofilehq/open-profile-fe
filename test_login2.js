const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('https://api.staging.open-profile.hng14.com/api/v1/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log("LOGIN BODY KEYS:", Object.keys(login.data.data || login.data));
    console.log("LOGIN DATA:", JSON.stringify(login.data, null, 2));
    console.log("LOGIN HEADERS:", login.headers['set-cookie']);
  } catch(e) {
    console.log("ERROR", e.response?.status, e.response?.data);
  }
}
test();
