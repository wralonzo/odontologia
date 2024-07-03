import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, Checkbox } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { useNavigate } from 'react-router';
import { SERVIDOR } from '../../../api/Servidor';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${SERVIDOR}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.jwt);
        navigate('/dashboard');
      } else {
        console.error('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}
      <Stack>
        <Box>
          <Typography variant="subtitle1"
            fontWeight={600} component="label" htmlFor='email' mb="5px">Correo Electronico</Typography>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box mt="25px">
          <Typography variant="subtitle1"
            fontWeight={600} component="label" htmlFor='password' mb="5px">Contraseña</Typography>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Recuerda este dispositivo"
            />
          </FormGroup>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          type="button"
        >
          Iniciar sesión
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;