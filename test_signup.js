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
    console.log("SIGNUP SUCCESSFUL");
    
    const login = await axios.post('https://api.staging.open-profile.hng14.com/api/v1/auth/login', {
      email,
      password
    });
    console.log("LOGIN SUCCESSFUL");
  } catch(e) {
    console.error("ERROR", e.response?.status, e.response?.data);
    process.exit(1);
  }
}
test();
