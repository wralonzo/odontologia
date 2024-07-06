import { useLocation, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { SERVIDOR } from '../../../api/Servidor';

const ModificationCreationInventory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const itemData = state?.item || {};
  const isEditing = !!itemData.id;
  const [itemId] = useState(isEditing ? itemData.id : '');
  const [name, setName] = useState(isEditing ? itemData.item_name : '');
  const [description, setDescription] = useState(isEditing ? itemData.description : '');
  const [quantity, setQuantity] = useState(isEditing ? itemData.quantity : '');

  const handleSubmit = async () => {
    const itemDataToUpdate = {
      item_name: name,
      description,
      quantity
    };
    if (isEditing) {
      itemDataToUpdate.id = itemId; 
      return handleUpdate(parseInt(itemData.id), itemDataToUpdate);
    } else {
      return handleCreate(itemDataToUpdate);
    }
  };

  const handleCreate = async (itemData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        alert('Artículo creado con éxito.');
        navigate('/inventory');
      } else {
        alert('Error al crear el artículo.');
      }
    } catch (error) {
      alert('No se puede crear el artículo en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleUpdate = async (itemId, itemData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVIDOR}/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        alert('Artículo actualizado con éxito.');
        navigate('/inventory');
      } else {
        alert('Error al actualizar el artículo.');
      }
    } catch (error) {
      alert('No se puede actualizar el artículo en este momento. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" mt={4}>
      <Box maxWidth="500px" width="100%">
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" align='center' mb={2} fontWeight={600}>
            {isEditing ? 'Actualizar información del artículo' : 'Agregar información del artículo'}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">
                Nombre
              </Typography>
              <CustomTextField id="name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="description" mb="5px">
                Descripción
              </Typography>
              <CustomTextField id="description" variant="outlined" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="quantity" mb="5px">
                Cantidad
              </Typography>
              <CustomTextField id="quantity" variant="outlined" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </Box>
            <Box>
              <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit}>
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ModificationCreationInventory;
