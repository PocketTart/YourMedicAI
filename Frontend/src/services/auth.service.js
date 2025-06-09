import axios from 'axios'; 

const API_URL = "http://localhost:8001/api/auth/"; 

const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "login", {
      email, 
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const signup = async (username, email, password) => {
  try {
    // console.log("hi");
    const response = await axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

const authService = {
  login,
  signup,
};

export default authService;