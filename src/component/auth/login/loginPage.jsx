import { useState, useContext } from "react";
import { login } from "../../../store/endpoint/auth/authentication";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting credentials:', credentials);
    try {
      await login(credentials);
      setIsLoggedIn(true);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <Box sx={{ width: "300px", margin: "50px auto", textAlign: "center" }}>
      <Typography variant='h4' gutterBottom>
        Login
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <Button variant='contained' type='submit' fullWidth>
          Login
        </Button>
      </form>
      <Typography variant='body2' sx={{ marginTop: 2 }}>
        Don`t have an account? <Link to="/register">Register here</Link>
      </Typography>
    </Box>
  );
};

export default Login;
