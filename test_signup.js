const axios = require('axios');
async function test() {
  const email = `test+${Date.now()}@example.com`;
  const password = 'Password123!';
  
  try {
    const signup = await axios.post('https://api.staging.open-profile.hng14.com/api/v1/auth/signup', {
      fullName: "Test User",
      email,
      password
    });
    console.log("SIGNUP DATA:", JSON.stringify(signup.data, null, 2));
    
    const login = await axios.post('https://api.staging.open-profile.hng14.com/api/v1/auth/login', {
      email,
      password
    });
    console.log("LOGIN BODY KEYS:", Object.keys(login.data.data || login.data));
    console.log("LOGIN DATA:", JSON.stringify(login.data, null, 2));
    console.log("LOGIN HEADERS:", login.headers['set-cookie']);
  } catch(e) {
    console.log("ERROR", e.response?.status, e.response?.data);
  }
}
test();
