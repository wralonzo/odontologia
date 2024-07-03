import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';

const ModificationCreationUser = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userData = state?.user || {};
  const isEditing = !!userData.id;
  const [name, setName] = useState(isEditing ? userData.name : '');
  const [lastName, setLastName] = useState(isEditing ? userData.last_name : '');
  const [phone, setPhone] = useState(isEditing ? userData.phone : '');
  const [address, setAddress] = useState(isEditing ? userData.address : '');
  const [email, setEmail] = useState(isEditing ? userData.email : '');
  const [typeOfUser] = useState(isEditing ? userData.type_of_user : '');

  const handleSubmit = async () => {
    const userDataToUpdate = {
      name,
      last_name: lastName,
      phone,
      address,
      email,
      type_of_user: typeOfUser
    };

    if (isEditing) {
      return handleUpdate(userData.id, userDataToUpdate);
    } else {
      return handleCreate(userDataToUpdate);
    }
  };

  const handleCreate = async (userData) => {
    try {
      const response = await fetch(`${SERVIDOR}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate('/ui/users');
      } else {
        alert('Error al crear el usuario.');
      }
    } catch (error) {
      alert('No se puede crear el usuario en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleUpdate = async (userId, userData) => {
    try {
      const response = await fetch(`${SERVIDOR}/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate('/ui/users');
      } else {
        alert('Error al actualizar el usuario.');
      }
    } catch (error) {
      alert('No se puede actualizar el usuario en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="500px" width="100%">
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="name"
              mb="5px"
            >
              Nombre
            </Typography>
            <CustomTextField
              id="name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="lastName"
              mb="5px"
            >
              Apellido
            </Typography>
            <CustomTextField
              id="lastName"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="phone"
              mb="5px"
            >
              Teléfono
            </Typography>
            <CustomTextField
              id="phone"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="address"
              mb="5px"
            >
              Dirección
            </Typography>
            <CustomTextField
              id="address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              id="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="type_of_user_label">Tipo de Usuario</InputLabel>
              <Select
                labelId="type_of_user_label"
                id="type_of_user"
                label="Tipo de Usuario"
                name="type_of_user"
              >
                <MenuItem value="SECRETARY">Secretaria</MenuItem>
                <MenuItem value="ADMINISTRATOR">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit}>
              Guardar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ModificationCreationUser;